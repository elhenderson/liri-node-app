require("dotenv").config();
var Spotify = require("node-spotify-api");


var axios = require("axios");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);



//Bands in Town
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

if (process.argv[2] === "spotify-this-song") {
  spotify.search({
    type: "track",
    query: "All the Small Things"
  }).then(function (response) {
    console.log(response.tracks.items[0].album.name);
    console.log(response.tracks.items[0].album.artists.name);
    console.log(response.tracks.items[0].name);
  })
}