const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const UserRoute=require('./routes/users');
const Blogroute = require('./routes/blog');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const blog = require('./models/blog');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogify').then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.resolve("./public")));

app.get('/',async (req, res) => {
    const allblogs=await blog.find({}).sort({ createdAt: -1 }).populate("createdBy");
    res.render("home",{
        user: req.user, 
        blogs: allblogs,
    });
});

app.get('/logout',(req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
});

app.use("/user",UserRoute);
app.use("/blog",Blogroute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});