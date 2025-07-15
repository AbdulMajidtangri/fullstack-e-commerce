const express  = require('express');
const path = require('path')
const mongoose =  require('mongoose');
const routes = require('./Routes/user')
const productRoutes = require('./Routes/product');
const Product = require('./modals/product');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const app = express();
const port =  3000;
const { requireAuth } = require('./service/user')
mongoose.connect('mongodb://localhost:27017/authoo').then(()=>{console.log("MongoDB  IS connected")
}).catch(()=>{"Unable to Establish the Connection with the Server"})


app.set('view engine','ejs');
app.set('views ',path.resolve('./views'))
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieparser());
app.use(session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));
app.use('/user',routes);
app.use('/product', productRoutes);

app.get('/', async (req, res) => {
   const products = await Product.find();
   res.render('home', {
     user: req.session.user || null,
     role: req.session.role || null,
     products
   });
});
app.listen(port,()=>{
    console.log(`The server is runnig over the port : ${port}`);
    
})