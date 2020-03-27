//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const https = require("https");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };



//global variable array for posts
let posts = [];

//getting the home page
app.get("/",function(req, res){
  res.render("home",
    {homeStarting:homeStartingContent,
    posts:posts
  });
});


//getting the about page
app.get("/about",function(req, res){
  res.render("about", {about:aboutContent});

});


//getting the contact page
app.get("/contact",function(req, res){
  res.render("contact", {contact:contactContent});
});


//getting the compose page
app.get("/compose",function(req,res){
  res.render("compose");
});


//express routing for posts
app.get("/posts/:postName", function(req,res){
  const requestTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);


  if(storedTitle == requestTitle){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }
  });


});


//posting the compose posts
app.post("/compose", function(req,res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});




let weathers = [];


app.get("/weather", function(req,res){
  res.render("weather", {
    weathers:weathers
  });
});

app.post("/weather", function(req,res){
weathers = [];
      const city = req.body.city;
      const units = "imperial";
      const apiKey = "de82c0db0c44c0274ea961ddad82002b"; //Yasha API Key
      const url = "https://api.openweathermap.org/data/2.5/weather?APPID=" + apiKey + "&q=" +city+ "&units=" + units;
      console.log(city);


      https.get(url, function(response){

          // gets individual items from Open Weather API
          response.on("data", function(data){
              const weatherData = JSON.parse(data);
              const minTemp = weatherData.main.temp_min;
              const maxTemp = weatherData.main.temp_max;
              const lat = weatherData.coord.lat;
              const lon = weatherData.coord.lon;
              const temp = weatherData.main.temp;
              const city = weatherData.name;
              const humidity = weatherData.main.humidity;
              const windSpeed = weatherData.wind.speed;
              const windDirection = weatherData.wind.deg;
              const weatherDescription = weatherData.weather[0].description;
              const icon = weatherData.weather[0].icon;
              const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

              const weather = {
                city: city,
                image: imageURL,
                temp: Math.round(temp),
                weatherDescription: weatherDescription,
                humidity: humidity,
                windDirection: windDirection
              };
              weathers.push(weather);
              res.redirect("/weather");

              // displays the output of the results

              //res.write("<h1 class=weather> The weather is " + weatherDescription + "<h1>");

              //res.write("<h1> The minimum temperature is " + minTemp + " degrees Farenheit. The maximum temperature is " + maxTemp + " degrees Farenheit. </h1>" );

              //res.write("<h1> The wind speed is " + windSpeed + " mph at " + windDirection + " degrees. </h1>" );

              //res.write("<h2>The Temperature in " + city + " is " + temp + " Degrees Fahrenheit<h2>");

              //res.write("Humidity is " + humidity + "% with wind speed of " + windSpeed+  " miles/hour");
              //res.write("<img src=" + imageURL +">");
              //res.send();
          });

});
});
weathers = [];





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
