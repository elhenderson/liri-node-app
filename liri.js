require("dotenv").config();
var Spotify = require("node-spotify-api");
var fs = require('fs');
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);



//Bands in Town
function concertSearch() {
  if (process.argv[2] === "concert-this") {
    var artist = process.argv.slice(3).join("");
    var bandsInTownUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
    axios.get(bandsInTownUrl).then(function (response) {
      
      
      for (let i = 0; i < 10; i++) {
      let dateTime = response.data[i].datetime
      let venue = response.data[i].venue

        console.log(`\n${venue.name}`);

        //checks for region
        if (venue.region) {
          console.log(`${venue.city}, ${venue.region}, ${venue.country}`);

        //if no region, display only city and country
        } else {
          console.log(`${venue.city}, ${venue.country}`);
        }

        //displays date & time
        console.log(`${dateTime.slice(5, -9)}-${dateTime.slice(0, -15)} ${dateTime.slice(11, -3)} \n`)
      }

    })
  }
}

//Spotify
function spotifySearch() {
  if (process.argv[2] === "spotify-this-song") {
    spotify.search({
      type: "track",
      query: process.argv.slice(3)
    }, function(err, response) {
      if (err) {
        console.log(`\nSorry, we couldn't find that song. How about this one?\n`);
        console.log("Ace of Base");
        console.log("Song name: The Sign")
        console.log("Song Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=9c033529f22a46f094b81858a68abae1")
        console.log(`Album: Happy Nation\n`);
      } else {
        for (i=0; i<10; i++) {
          let song = response.tracks.items[i];
          console.log(`\nArtist(s): ${song.album.artists[0].name}`);
          console.log(`Song preview: ${song.preview_url}`);
          console.log(`Song name: ${song.name}`);
          console.log(`Album: ${song.album.name}\n`);
        }
      }
    })
  }
}

//OMDB
function movieSearch() {
    if (process.argv[2] === "movie-this") {
    let movie = process.argv.slice(3).join("+");
    let movieURL = `http://www.omdbapi.com/?t=${movie}&apikey=trilogy`
    if (!process.argv[3]) {
      axios.get(`http://www.omdbapi.com/?t=Mr.+Nobody&apikey=trilogy`).then(function (response) {        
          console.log(`\nLooks like you haven't entered anything. If you haven't, you should check out this movie!`);
          var movieInfo = response.data
          console.log(`\nTitle: ${movieInfo.Title}`);
          console.log(`Year: ${movieInfo.Year}`);
          console.log(`IMDB Rating: ${movieInfo.imdbRating}`);
          console.log(`Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}`);
          console.log(`Country: ${movieInfo.Country}`);
          console.log(`Language: ${movieInfo.Language}`);
          console.log(`Plot: ${movieInfo.Plot}`);
          console.log(`Actors: ${movieInfo.Actors}\n`)
      }) 
    } else {
      axios.get(movieURL).then(function (response) {
        var movieInfo = response.data
        console.log(`\nTitle: ${movieInfo.Title}`);
        console.log(`Year: ${movieInfo.Year}`);
        console.log(`IMDB Rating: ${movieInfo.imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}`);
        console.log(`Country: ${movieInfo.Country}`);
        console.log(`Language: ${movieInfo.Language}`);
        console.log(`Plot: ${movieInfo.Plot}`);
        console.log(`Actors: ${movieInfo.Actors}\n`)
      })
    }
  }
}

//Do what it says
if (process.argv[2] === "do-what-it-says") {
  fs.readFile('./random.txt', "utf-8", function (err, data) {
    if(err) {
      console.log(err);
    } else {
      var splitText = data.split(",");
      console.log(splitText)
    }
  })
}


movieSearch();
spotifySearch();
concertSearch();