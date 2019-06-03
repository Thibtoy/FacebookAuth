const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./api/models/user');
const localStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./api/config/config');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

mongoose.connect('mongodb://localhost:27017/FbAuth', { useCreateIndex: true, useNewUrlParser: true });

const db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
	secret: config.SECRET,
	saveUninitialized: true,
	resave: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.use(new localStrategy(function(username, password, done){
	User.getUserByUsername(username, function(err , user){
		if (err) throw err;
		if (!user) return done(null, false, {message: 'unknown user'});
		User.comparePassword(password, user.password, function(err, isMatch){
			if (err) throw err;
			if (isMatch) return done(null, user);
			else return done(null, false, {message: 'invalid password'});
		});
	});
}));

passport.use(new FacebookStrategy({clientID: config.API_ID, clientSecret: config.SECRET_KEY, callbackURL: "http://localhost:3000/auth/facebook/callback"}, function(accessToken, refreshToken, profile, done) {
	User.findOne({'facebook.id' : profile.id}, function(err, user) {
		if (err) return done(err);
		if (user) return done(null, user);
		else {
			let newUser = new User();
			newUser.facebook.id = profile.id;
			newUser.facebook.token = accessToken;
			newUser.facebook.name = profile.displayName;

			if (typeof profile.emails != 'undefined' && profile.emails.length > 0) {
				newUser.facebook.email = profile.emails[0].value;
			}
			newUser.save(function(err) {
				if (err) throw err;
				return done(null, newUser);
			});
		}
	});
}));

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(id, function(err, user){
		done(err, user);
	});
});

function isLoggedIn(request, response, next) {
    // passport adds this to the request object
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login');
}


//Register User in db
app.post('/register', function(req, res){
	var password = req.body.password;
	var password2 = req.body.password2;

	if (password == password2) {
		var newUser = new User({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
			name : req.body.name
		});
		User.createUser(newUser, function(err, user) {
		if (err) throw err;
		res.send(user).end()
		});
	} else {
		res.status(500).send("{errors: \"Password don't match\"}").end()
	}
});

app.post('/login', passport.authenticate('local', {successRedirect: '/user', failureRedirect: '/login', failureFlash: true}), function(req, res){
	res.send(req.user);
});

app.get('/user', isLoggedIn, function(req,res){
	res.send(req.user);
});

app.get('/logout', function(req, res){
	req.logout();
	res.send(null);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), function(req, res){
	res.redirect('/user');
});

app.listen(port, () => console.log('App listening on port 3000'));