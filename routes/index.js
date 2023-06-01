var express = require('express');
var router = express.Router();
const request = require('request')
const passport = require('passport')

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8' 

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req,res,next) => {
  res.locals.imageBaseUrl = imageBaseUrl
  next()
})

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  request.get(nowPlayingUrl,(error,response, movieData) => {
  
    const parseData = JSON.parse(movieData)
    res.render('index', { parseData: parseData.results, user: req.user });
  })
})

router.get('/login', passport.authenticate('github'));

router.get('/auth', passport.authenticate('github',{
  successRedirect: '/',
  failureRedirect: '/loginFailed',
}));

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// router.get('/logout', (req, res) => {
//   console.log(req)
//   req.logout();
//   res.redirect('/');
// });

router.get('/favorites', (req,res,next) => {
  res.json(req.user.displayName)
})

router.get('/movie/:id',(req,res,next) => {
  const movieId = req.params.id
  const singleMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
  
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
