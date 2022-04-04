//jshint esversion:6
// activate
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
// const
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// set EJS
app.set('view engine', 'ejs');
// Use body-parser + json and Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//==============================================================================
// Connect with mongodb database
mongoose.connect("mongodb://localhost:27017/techSnackDB", {useNewUrlParser: true});

// Create a new Schema to store blogposts.
const postSchema = {
  title: String,
  content: String
}
// Create model
const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "welcome to your new blog",
  content: "You got a fresh blank sheet!"
});

const defaultPosts = [post1];
//==============================================================================
// home page + blogposts
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      blogText: defaultPosts,
      posts: posts
      });
  });

// The value of myTruncatedString is "ABC"
});
//==============================================================================
// about page && about content
app.get('/about',function(req,res){
  res.render('about.ejs', {
    aboutText: aboutContent
  });
});
//==============================================================================
// Contact page && contact content const
app.get('/contact',function(req,res){
  res.render('contact.ejs', {
    contactText: contactContent
  });
});
//==============================================================================
// Compose page for making blogposts.
app.get('/compose',function(req,res){
  res.render('compose.ejs');
});

//==============================================================================
// Creating a /posts with a second route the post name
//  Find the post with matching post ._id
app.get('/posts/:postId', function(req,res){
// request the postId found in home.ejs as a EJS Value of post._id
// Mongodb automatic makes a id for every post.
  const requestedPostId = req.params.postId;

  const requestedTitle = _.lowerCase(req.params.postName);
// find the ._id from the clicked post. and render this post in the post.ejs file
// with a title and content as specified.
  Post.findOne({_id: requestedPostId}, function(err, post){
   res.render("post.ejs", {
     title: post.title,
     content: post.content
   });
 });

});
//==============================================================================

// Post title and content recieved from newTitle % newContent input html
app.post('/compose',function(req,res){
 // request a title and content from /compose route
  const post = new Post ({
    title: req.body.newTitle,
    content: req.body.newContent
  });

// save posts if no error, en redirect to home router
  post.save(function(err){
    if(!err){
      res.redirect('/');
    }if (err){
      console.log(err);
    }
  });

});

//==============================================================================
// Listen to port and give a comment that server has started in terminal
app.listen(3222, function() {
  console.log("Server started on port 3222");
});
