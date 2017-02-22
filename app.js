var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Contact     = require("./models/contact")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blog"),
    indexRoutes      = require("./routes/index")
    
//mongoose.connect("mongodb://localhost/website");
mongoose.connect("mongodb://*****:*******@ds157539.mlab.com:57539/website58");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "qwerty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server sucessfully started");
});