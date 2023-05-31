var express = require('express');
var router = express.Router();
const request = require('request')
// const apiKey = '1fb720b97cc13e580c2c35e1138f90f8' 

// const apiBaseUrl = 'http://api.themoviedb.org/3';
// const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const apiKey = '123456789' 

const apiBaseUrl = 'http://localhost:3030';
const nowPlayingUrl = `${apiBaseUrl}/most-popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req,res,next) => {
  res.locals.imageBaseUrl = imageBaseUrl
  next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
  request.get(nowPlayingUrl,(error,response, movieData) => {
    // console.log("--------------Error------------")
    // console.log(error)
    // console.log("--------------Response------------")
    // console.log(response)
    // console.log("--------------Movie Data------------")
    // console.log(movieData)
    const parseData = JSON.parse(movieData)
    // console.log(parseData)
    // res.json(parseData)
    res.render('index', { parseData: parseData.results });
  })
});

router.get('/movie/:id',(req,res,next) => {
  const movieId = req.params.id
  // console.log(req.params.id)
  const singleMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
  // console.log(singleMovieUrl)
  request.get(singleMovieUrl,(error,response, movieData) => {
    const parseData = JSON.parse(movieData)
  res.render('single-movie',{parseData: parseData})

  })
})

router.post('/search',(req,res,next) => {
  const category = req.body.cat
  const searchTerm = encodeURI(req.body.movieSearch)

  const movieUrl = `${apiBaseUrl}/search/${category}?query=${searchTerm}&api_key=${apiKey}`
  
  request.get(movieUrl,(error,response,movieRes) => {
  // res.send(movieUrl)
    let parseData = JSON.parse(movieRes)
    if(category == "person" && parseData.results.length > 0){
      parseData.results = parseData.results[0].known_for
    }

    res.render('index', {
      parseData : parseData.results 
    })

  })
})

module.exports = router;
