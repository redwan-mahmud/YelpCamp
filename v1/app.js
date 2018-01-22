var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP 
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//  Campground.create(
//      {
//                  name: "Salmon Creek", 
//                  image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//                  description: "This is a huge granide hill"       
// }, function(err, campground){
//         if(err){
//              console.log(err);
//          } else {
//              console.log("NEWLY created campground: ");
//              console.log(campground);
//          }
//      });

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
        Campground.find({}, function(err,allCampgrounds){
            if(err){
                console.log(err);
            } else{
                res.render("index",{campgrounds: allCampgrounds});
            }
        });
       // res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req,res){
    //res.send("You hit the post route")
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
    //res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});


app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started");
});