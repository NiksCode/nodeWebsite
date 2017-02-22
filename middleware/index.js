var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err){
               req.flash("error", "Blog not found");
               res.redirect("back");
           }  else {
               // does user own the blog?
            if(foundBlog.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkIfAdmin = function(req, res, next){
    if(req.isAuthenticated() && (req.user.username == 'admin')){
  
        return next();
    }
    req.flash("error", "You have to be the administrator to acess that page");
    res.redirect("/blog");
}

module.exports = middlewareObj;