const productmodal = require('../modals/product');
const express = require('express');
const routes = express.Router();
const { showaddproductspage , handleaddproduct, handledeleteproduct } = require('../Controller/product')
routes.get('/addproduct',showaddproductspage);
routes.post('/addproduct',require('../middleware/upload').single('image'),handleaddproduct);
routes.post('/delete/:id', handledeleteproduct);
module.exports  = routes; 