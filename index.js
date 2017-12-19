let express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    request = require("request"),
    randomMC = require('random-material-color');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req, res) {
    // POPULARITY
    request("https://api.themoviedb.org/3/discover/movie?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1", function(error, response, body) {
        if(!error && response.statusCode == 200) {
            let data = JSON.parse(body);
            // GENRE
            request("https://api.themoviedb.org/3/genre/movie/list?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US", function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    let genres = JSON.parse(body);
                    // UPCOMING
                    request("https://api.themoviedb.org/3/movie/upcoming?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US&page=1", function(error, response, body) {
                       if(!error && response.statusCode == 200) {
                           let upcoming = JSON.parse(body);
                        //   TOP RATED
                           request("https://api.themoviedb.org/3/discover/movie?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1", function(error, response, body) {
                              if(!error && response.statusCode == 200) {
                                  let topRated = JSON.parse(body);
                                //   MOST REVENUE
                                  request("https://api.themoviedb.org/3/discover/movie?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=1", function(error, response, body) {
                                     if(!error && response.statusCode == 200) {
                                         let mostRevenue = JSON.parse(body);
                                         res.render("index", {data: data, genres: genres, randomMC: randomMC, upcoming: upcoming, topRated: topRated, mostRevenue: mostRevenue});
                                     }
                                  });
                              }
                           });
                       }
                    });
                }
            });
        }
    });
});

app.get("/movie/:id", function(req, res) {
    // FIND MOVIE DETAILS
    request("https://api.themoviedb.org/3/movie/" + req.params.id + "?api_key=1208e42d5f9244b06b09af5465f9e155&append_to_response=videos&language=en-US", function(error, response, body) {
        if(error) {
            console.log(error);
            res.redirect("/");
        } else if (response.statusCode == 200) {
            let movie = JSON.parse(body);
            // FIND REVIEW DETAILS
            request("https://api.themoviedb.org/3/movie/" + req.params.id + "/reviews?api_key=1208e42d5f9244b06b09af5465f9e155&language=en-US", function(error, response, body) {
                if(error) {
                    console.log(error);
                    res.redirect("/");
                } else if(response.statusCode == 200) {
                    let reviews = JSON.parse(body);
                    res.render("moviesingle", {movie: movie, reviews: reviews});
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log("Server has started");
});
