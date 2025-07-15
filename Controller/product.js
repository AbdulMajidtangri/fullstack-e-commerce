const productmodal = require("../modals/product");
const showaddproductspage = (req, res) => {
  return res.render("addproduct");
};
const handleaddproduct = async (req, res) => {
  try {
    const { Name, description, price } = req.body;
    let image = null;
    if (req.file) {
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const userId = req.session.user ? req.session.user._id : null;
    const findproduct = await productmodal.findOne({ Name });
    if (!findproduct) {
      const newproduct = await productmodal.create({
        Name,
        image, // Save the image buffer and content type
        description,
        price,
        user: userId // Save the user ID
      });
      console.log("New Product Successfully added");
      return res.redirect("/");
    }
    return res.render("addproduct", { error: "Product already exist" });
  } catch (error) {
    console.error("AddProduct error:", error.message);
    return res.render("addproduct", { error: "Invalid credentials" });
  }
};
const handledeleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productmodal.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};
module.exports = { showaddproductspage, handleaddproduct, handledeleteproduct };
