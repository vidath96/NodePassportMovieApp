var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const helmet = require('helmet')
//-----------PASSPORT FILES-----------//
const session = require('express-session')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy

// GitHub Client ID 8732ec03a3dc68b9578c
// GitHub Client Secret fe98eea4009895f6a6b9fff8e050362303d88361

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));

//------------- Passport GitHub Strategy Config-------------//
app.use(session({
  secret: 'My Movie App Session',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())
const githubConfig = require('./gitconfig')
passport.use(new GitHubStrategy(githubConfig,
function(accessToken, refreshToken, profile, cb) {
  // console.log(profile)
  return cb(null, profile);
}
));

passport.serializeUser(function(user, cb) {
  // process.nextTick(function() {
    cb(null,user);
  // });
});

passport.deserializeUser(function(user, cb) {
  // process.nextTick(function() {
    cb(null,user);
  // });
});

//----------------------------------------------------------//

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
