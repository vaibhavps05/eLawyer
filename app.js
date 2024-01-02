if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkAuthenticated, function(req,res){
    res.render("home");
  });


  app.get("/team", function(req,res){
    res.render("team");
  });


  app.get("/about", function(req,res){
    res.render("about");
  });


  app.get("/blog", function(req,res){
    res.render("blog");
  });


  app.get("/student", function(req,res){
    res.render("student");
  });


  app.get("/login", checkNotAuthenticated, function(req,res){
    res.render("login");
  });


  app.get("/registerC", function(req,res){
    res.render("registerC");
  });


  app.get("/registerL", checkNotAuthenticated, function(req,res){
    res.render("registerL");
  });


  app.get("/family", function(req,res){
    res.render("family");
  });


  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));


  app.post("/registerL", checkNotAuthenticated, async (req,res) => {
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      res.redirect("/login");
    }
    catch{
      res.redirect("/registerL");
    }
    console.log(users);
  });

 
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/login');
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }

 
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
