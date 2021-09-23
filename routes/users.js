var express = require('express');
var User = require('../models/User');
var auth = require('../auth/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//register user

router.get('/register', (req, res, next) => {
  res.render('userRegisterForm');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
});

//user login

router.get('/login', (req, res, next) => {
  res.render('userLoginForm');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  //if fields are empty
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);
    //if no email match
    if (!user) {
      return res.redirect('/users/login');
    }
    user.checkPassword(password, function (err, result) {
      if (err) return next(err);
      //password didnt match
      if (!result) {
        return res.redirect('/users/login');
      }
      //password match
      req.session.userId = user.id;
      req.session.userType = user.userType;

      res.redirect('/home');
    });
  });
});

router.get('/logout', auth.isLoggedIn, (req, res, next) => {
  req.session.destroy();
  req.user = null;
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;
