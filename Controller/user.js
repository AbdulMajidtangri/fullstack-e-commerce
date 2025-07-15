const usermodal = require("../modals/user");
const { secret, generatetoken } = require("../service/user");
const bcrypt = require("bcryptjs");
const adminemail = "admin@gmail.com";
const productmodal = require("../modals/product");
const showusersignup = (req, res) => {
  return res.render("signup");
};
const showusersignin = (req, res) => {
  return res.render("signin");
};
const handleuserSignup = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;
    const ProfileImage = req.file ? req.file.filename : null;
 
    const finduser = await usermodal.findOne({ email });
    if (finduser) {
      return res.render("signin", { error: "Account already exists. Please sign in." });
    }

    await usermodal.create({
      name,
      lastname,
      profileImage: ProfileImage,
      email,
      password, 
    });

    return res.render("signin", { error: null, message: "Account created successfully. Please sign in." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const handleuserSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodal.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.render("signin", { error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.render("signin", { error: "Invalid credentials" });
    }

    // Set JWT token cookie for authentication
    const token = generatetoken(user);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set role in session and redirect to home
    if (email === adminemail) {
      req.session.role = 'admin';
      req.session.user = user;
      return res.redirect("/");
    } else {
      req.session.role = 'user';
      req.session.user = user;
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Signin error:", error.message);
    return res.render("signin", { error: "Invalid credentials" });
  }
};

const handleuserlogout = async (req, res) => {
  const products = await productmodal.find();
  return res
    .clearCookie("token")
    .render("home", { user: null, role: null, message: "You have been logged out.", products });
};
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const productId = req.params.productId;
    const user = await usermodal.findById(userId);
    // Check if product already in cart
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }
    await user.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error adding to cart');
  }
};

const showcartpage = async (req, res) => {
  const user = await usermodal.findById(req.user._id).populate('cart.product');
  res.render('cart', { cart: user.cart });
}
module.exports = {
  showusersignup,
  showusersignin,
  handleuserSignup,
  handleuserSignin,
  handleuserlogout,
  showcartpage,
  addToCart
};
