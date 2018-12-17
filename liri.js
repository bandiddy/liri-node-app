require("dotenv").config();

var keys = require("./keys.js")

var fs = require("fs")

var moment = require("moment")

var request = require("request")

var Spotify = require("node-spotify-api")

var spotify = new Spotify(keys.spotify);

var search = process.argv[2]

var term = process.argv.slice(3).join(" ");

searchAll(search, term)

if (!search) {
  search = "spotify-this";
}

if (!term) {
  term = "Drake";
}

function searchAll() {

  if (search === "spotify-this-song") {
    console.log("Searching for Spotify song");
    spotifyThis(term);

  }

  else if (search === "concert-this") {
    console.log("Searching for concert");
    concertThis(term);

  }
  else if (search === "movie-this") {
    console.log("Searching for movie");
    movieThis(term);

  }

  else if (search === "do-what-it-says") {
    console.log("Doing What It Says");
    doWhatItSays(term);
  }
  else {
    Instructions()
  }

}

function spotifyThis(song, artist) {
  if (song === undefined) {
    song === "XO Tour Lif3"
    artist === "Brasstracks"
  }

  var spotSearch

  if (artist)
    spotSearch = artist + " " + song

  else
    spotSearch = song

  spotify.search({
    type: "track",
    query: song,
    limit: 1
  }, function (err, data) {
    if (err) {
      console.log("error:", err)
    }


    data = data.tracks.items[0]

    var artist = data.artists
    var artistStr = artist[0].name
    for (var i = 1; i < artist.length; i++)
      artistStr += ", " + artist[i].name

    console.log("----------------------------")
    console.log("Artist: ", artistStr)
    console.log("Album: ", data.album.name)
    console.log("Song: ", data.name)
    console.log("Preview: ", data.preview_url)
    console.log("----------------------------")
  })
}
function Instructions() {
  console.log("Use these commands to request concert, spotify song/artist, or movie:");
  console.log("concert-this");
  console.log("spotify-this-song");
  console.log("movie-this");
  console.log("do-what-it-says");
}

function concertThis(artist) {
  if (artist === undefined) {
    Instructions()
  }

  var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

  requestURL(url, function (body) {
    body = JSON.parse(body)
    for (var i = 0; i < body.length; i++) {
      var event = body[i]
      var date = event.datetime

      console.log("----------------------------")
      console.log("Venue: ", event.venue.name)
      console.log("Location: ", event.venue.city + " " + event.venue.region)
      console.log("Date: ", moment(date).format("MM/DD/YYYY"))
      console.log("----------------------------")

    }
  })
}

function requestURL(url, callback) {
  request(url, function (err, res, body) {
    if (err) {
      console.log("Failed to do request")
      console.log("Error:", err)
    }
    if (!res || res.statusCode != 200) {
      console.log("Failed to do request.")
      console.log("Response:", res)
    }
    callback(body)
  })
}

function movieThis(movie) {
  if (movie === undefined) {
    Instructions()
  }
  var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
  requestURL(url, function (data) {
    data = JSON.parse(data)

    console.log("----------------------------")
    console.log("Title: ", data.Title)
    console.log("Year: ", data.Year)
    console.log("IMDB Score:", data.imdbRating);
    for (var i = 0; i < data.Ratings.length; i++) {
      if (data.Ratings[i].Source === "Rotten Tomatoes") {
      console.log("RT Rating: ", data.Ratings[i].Value);
      }
    }
    console.log("Country: ", data.Country);
    console.log("Language: ", data.Language);
    console.log("Plot: ", data.Plot);
    console.log("Actors: ", data.Actors);
    console.log("----------------------------")
  })
}

function doWhatItSays() {
  var fileData = fs.readFileSync("random.txt")
  var dataSplit = fileData. toString().split(",")
  searchAll(dataSplit[0], dataSplit[1], dataSplit[2])

}