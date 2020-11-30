export{}
const express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	User = require('../models/user');

router.get('/', function(req: any, res: any) {
	res.render('landing');
});
router.get('/register', function(req: any, res: any) {
	res.render('register');
});
// handle sign up logic
router.post('/register', function(req: any, res: any) {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err: any, user: any) {
		if (err) {
			req.flash('error', err.message);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function() {
			req.flash('success', 'Welcome to Happy Paws Hotels, ' + user.username);
			res.redirect('/hotels');
		});
	});
});

// show login form
router.get('/login', function(req: any, res: any) {
	res.render('login');
});
// handle login logic
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/hotels',
		failureRedirect: '/login'
	}),
	function(req: any, res: any) {}
);

// logout logic
router.get('/logout', function(req: any, res: any) {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/hotels');
});

module.exports = router;