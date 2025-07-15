const { Schema, model, Types } = require('mongoose');
const bcrypt = require("bcryptjs"); // Use bcryptjs for hashing
const { generatetoken } = require("../service/user");

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  cart: [{
    product: { type: Types.ObjectId, ref: 'product' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.statics.authenticateuserAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const userObj = user.toObject();
  delete userObj.password;
  const token = generatetoken(userObj);
  return token;
};

const user = model("user", userSchema);
module.exports = user;
