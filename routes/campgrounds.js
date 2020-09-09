var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment")

var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/",function(req,res){
	//res.render("campgrounds",{campgrounds:campgrounds});
	//console.log(req.user);
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
		res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});

		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	//res.send("You hit the post route")
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var discription = req.body.discription;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newCampgrounds = {name:name,image:image,discription:discription,author:author};
	Campground.create(newCampgrounds,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});


router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});


router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			//console.log(foundCampground);
				res.render("campgrounds/show",{campground:foundCampground});

		}
	});
});


router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
	
});


router.put("/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	})
})



module.exports = router;

