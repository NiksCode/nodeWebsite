var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Contact = require("../models/contact");
var middleware = require("../middleware");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to my blog, " + user.username);
           res.redirect("/blog"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blog",
        failureRedirect: "/login"
    }), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

router.get("/contact", function(req, res){
    res.render("contact");
});

router.put("/contact", function(req, res){

    Contact.create(req.body.contact, function(err, contact){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            req.flash("error", "Ups, something went wrong. Your message wasn't sent");
            res.redirect("/contact");
        } else {
            contact.save();
            console.log(contact);
           req.flash("success", "Thanks for contacting me! I'll get back to you shortly.");
           res.redirect("/");
        }
    })
});




router.get("/about", function(req, res){
    res.render("about");
});



router.get("/admin", middleware.checkIfAdmin, function(req, res){
  Contact.find({}, function(err, allContacts){
      if(err){
          console.log(err);
      } else {
          res.render("admin", {contacts: allContacts});
      }
        });
    });
module.exports = router;