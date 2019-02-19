require("dotenv").config();
var Spotify = require("node-spotify-api");
var fs = require('fs');
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);



//Bands in Town
function concertSearch(randomTxt) {
  var queryParm;
  if (randomTxt) {
    queryParm = randomTxt;
  } else {
    queryParm = process.argv.slice(3).join("")
  }
  var bandsInTownUrl = `https://rest.bandsintown.com/artists/${queryParm}/events?app_id=codingbootcamp`;
  axios.get(bandsInTownUrl).then(function (response) {
    
    fs.appendFile("log.txt", `\n-------------\nConcert search\n-------------`, function(err) {
      if (err) throw err;
    })
    for (let i = 0; i < 10; i++) {
    let dateTime = response.data[i].datetime
    let venue = response.data[i].venue

      var containInfo = `\n${venue.name}`;

      //checks for region
      if (venue.region) {
        containInfo += `\n${venue.city}, ${venue.region}, ${venue.country}`;

      //if no region, display only city and country
      } else {
        containInfo += `\n${venue.city}, ${venue.country}`;
      }

      //displays date & time
      containInfo += `\n${dateTime.slice(5, -9)}-${dateTime.slice(0, -15)} ${dateTime.slice(11, -3)} \n`

      console.log(containInfo);
      fs.appendFile("log.txt", containInfo, function(err) {
        if (err) throw err;
      })
    }
    console.log(`This info has been added to log.txt!\n`);
  })
}


//Spotify
function spotifySearch(randomTxt) {
  var queryParm;
  if (randomTxt) {
    //Using 'do-what-it-says'
    queryParm = randomTxt;
  } else {
    //Using 'spotify-this-song'
    queryParm = process.argv.slice(3);
  }
  spotify.search({
    type: "track",
    query: queryParm
  }, function(err, response) {
    //if no song is found or no query is given, output a default
    if (err) {
      //Puts all the necessary info into a variable to be able to write to file
      var containInfo = `\nSorry, we couldn't find that song. How about this one?\n\nAce of Base\nSong name: The Sign\nSong Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=9c033529f22a46f094b81858a68abae1\nAlbum: Happy Nation\n`;
      console.log(containInfo);
      //Separator for clarity in log.txt
      fs.appendFile("log.txt", `\n-------------\nSpotify search\n-------------${containInfo}`, function(err) {
        if (err) throw err;
        console.log(`This info has been added to log.txt!\n`);
      })
    } else {
      fs.appendFile("log.txt", `\n-------------\nSpotify search\n-------------`, function(err) {
        if (err) throw err;
      })
      //lists out info for 10 songs
      for (i=0; i<10; i++) {
        let song = response.tracks.items[i];
        var containInfo = `\nArtist(s): ${song.album.artists[0].name}\nSong preview: ${song.preview_url}\nSong name: ${song.name}\nAlbum: ${song.album.name}\n`;
        console.log(containInfo);
        fs.appendFile("log.txt", containInfo, function(err) {
          if (err) throw err;
        })
      }
      console.log(`This info has been added to log.txt!\n`);
    }
  })
}


//OMDB
function movieSearch(randomTxt) {
  var queryParm;
  if (randomTxt) {
    //using 'do-what-it-says'
    queryParm = randomTxt;
  } else {
    //using 'movie-this'
    queryParm = process.argv.slice(3).join("+");
  }
  let movieURL = `http://www.omdbapi.com/?t=${queryParm}&apikey=trilogy`
  //if no parm is given, output a default
  if (!queryParm) {
    axios.get(`http://www.omdbapi.com/?t=Mr.+Nobody&apikey=trilogy`).then(function (response) {        
        console.log(`\nLooks like you haven't entered anything. If you haven't, you should check out this movie!`);
        var movieInfo = response.data
        //Stores all log info into a variable to put into write function
        var containInfo = `\nTitle: ${movieInfo.Title}\nYear: ${movieInfo.Year}\nIMDB Rating: ${movieInfo.imdbRating}\nRotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}\nCountry: ${movieInfo.Country}\nLanguage: ${movieInfo.Language}\nPlot: ${movieInfo.Plot}\nActors: ${movieInfo.Actors}\n`;
        console.log(containInfo);
        //Separator for better readability
        fs.appendFile("log.txt", `\n-------------\nMovie search\n-------------${containInfo}`, function(err) {
          if (err) throw err;
          console.log(`This info has been added to log.txt!\n`);
        })
    }) 
  } else {
    axios.get(movieURL).then(function (response) {
      var movieInfo = response.data
      var containInfo = `\nTitle: ${movieInfo.Title}\nYear: ${movieInfo.Year}\nIMDB Rating: ${movieInfo.imdbRating}\nRotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}\nCountry: ${movieInfo.Country}\nLanguage: ${movieInfo.Language}\nPlot: ${movieInfo.Plot}\nActors: ${movieInfo.Actors}\n`
      console.log(containInfo);
      fs.appendFile("log.txt", `\n-------------\nMovie search\n-------------${containInfo}`, function(err) {
        if (err) throw err;
        console.log(`This info has been added to log.txt!\n`);
      })
    })
  }
}


//Do what it says
function readRandomTxt() {
  if (process.argv[2] === "do-what-it-says") {
    fs.readFile('./random.txt', "utf-8", function (err, data) {
      if(err) {
        console.log(err);
      } else {
        var splitText = data.split(",");
        console.log(splitText[1])
        if (splitText[0] === "spotify-this-song") {
          spotifySearch(splitText[1]);
        } else if (splitText[0] === "concert-this") {
          concertSearch(splitText[1]);
        } else if (splitText[0] === "movie-this") {
          movieSearch(splitText[1]);
        }
      }
    })
  }
}


//calls
function initialize() {
  if (process.argv[2] === "movie-this") {
    movieSearch();
  } else if (process.argv[2] === "spotify-this-song") {
    spotifySearch();
  } else if (process.argv[2] === "concert-this") { 
    concertSearch();
  } else if (process.argv[2] === "do-what-it-says") {
    readRandomTxt();
  }
}

initialize();