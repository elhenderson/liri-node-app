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