var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");


//INDEX - show all 
router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, allPosts){
       if(err){
           console.log(err);
       } else {
          res.render("blog/index",{posts:allPosts});
       }
    });
});

//CREATE - add new post to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to posts array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {name: name, image: image, description: desc, author:author}
    // Create a new blog and save to DB
    Blog.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            console.log(newlyCreated);
            res.redirect("/blog");
        }
    });
});

//NEW - show form to create new post
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blog/new"); 
});

// SHOW - shows more info about one post
router.get("/:id", function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with that blog
            res.render("blog/show", {blog: foundPost});
        }
    });
});

// EDIT POST ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundPost){
        res.render("blog/edit", {blog: foundPost});
    });
});

// UPDATE POST ROUTE
router.put("/:id",middleware.checkPostOwnership, function(req, res){
    // find and update the correct blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedPost){
       if(err){
           res.redirect("/blog");
       } else {
           //redirect somewhere(show page)
           res.redirect("/blog/" + req.params.id);
       }
    });
});

// DESTROY POST ROUTE
router.delete("/:id",middleware.checkPostOwnership, function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blog");
      } else {
          res.redirect("/blog");
      }
   });
});


module.exports = router;

