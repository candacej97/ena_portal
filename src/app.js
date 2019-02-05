const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
require('./db');

const app = express();
const auth = require('./auth.js');

// enable information
app.use(session({
	secret: 'keyboard secretive',
	resave: false,
	saveUninitialized: false,
	cookie: { expires: false }
}));

// retrieving the model registered with mongoose
const ANNOUNCEMENTS = mongoose.model('announcements');
// const USERS = mongoose.model('users');
// TODO: implement promo-admins and uncomment the following line
// const PROMOS = mongoose.model('promos');

// serve static files
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// change views directory
app.set('views', path.join(__dirname, 'views'));

// set up handlebars
app.set('view engine', 'hbs');

// parses the http req body and creates a prop on the req object called body
app.use(express.urlencoded({ extended: false }));

// have the app find out if the current user is signed in
app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

app.get('/', (req, res) => {
	if (req.session.user) {
		res.redirect('/user');
	}
	else {
		// get all announcements and render them on this page
		ANNOUNCEMENTS.find({}, (err, docs) => {
			if (!err) {
				res.render('index', { announcements: docs });
			}
			else {
				console.log(`No announcements could be found: ${err}`);
			}
		});
	}

});

app.get('/register', (req, res) => {
	if (req.session.user) {
		res.redirect('/user');
	} else {
		res.render('register');
	}
});

app.post('/register', (req, res) => {
	// get all input
	const { username, password } = req.body;
	// send all input to auth file
	// this can also be changed to auth by an external method (FB, Google, etc.)
	auth.register(username, password, (err) => {
		res.render('register', err);
	}, (user) => {
		auth.startAuthenticatedSession(req, user, (err) => {
			if (!err) {
				res.redirect('/user');
			}
		});
	});
});

app.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/user');
	} else {
		res.render('login');
	}
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;
	auth.login(username, password, (err) => {
		res.render('login', err);
	}, (user) => {
		auth.startAuthenticatedSession(req, user, (err) => {
			if (!err) {
				res.redirect('/user');
			}
		});
	});
});

app.get('/signout', (req, res) => {
	if (req.session.user) {
		req.session.user = null;
		res.redirect('/');
	}
	else {
		res.redirect('/');
	}
});

app.get('/user', (req, res) => {
	// block any user that isn't logged in
	if (req.session.user) {
		// find all announcments that are associated with the user
		ANNOUNCEMENTS.find({ submitedBy: req.session.user._id }, (err, docs) => {
			if (!err) {
				res.render('user-home', { announcements: docs });
			}
			else {
				res.render('user-home', { message: "You have no submissions." });
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/user/add', (req, res) => {
	// block any user that isn't logged in
	if (req.session.user) {
		res.render('announcement-add');
	}
	else {
		res.redirect('/login');
	}
});

app.post('/user/add', (req, res) => {
	// retrieve all form input from rendered page
	const { name, location, description, date, startTime: start, endTime: end, deadline, price, districtEvent, promoRequest, promoMaterial } = req.body;
	let startTime, endTime;

	// create a timestamp
	const createdAt = new Date().toLocaleString();
	if (start) {
		const timeArr = start.split(':');
		startTime = timeArr.join('');
	}

	if (end) {
		const timeArr = end.split(':');
		endTime = timeArr.join('');
	}

	// add to db
	new ANNOUNCEMENTS({ submitedBy: req.session.user._id, name: name, location: location, desc: description, date: date, start_time: startTime, end_time: endTime, deadline: deadline, price: price, district_event: (districtEvent === "on" ? true : false), promo_request: (promoRequest === "on" ? true : false), promo_material: promoMaterial, createdAt: createdAt }).save((err) => {
		if (!err) {
			res.redirect('/');
		}
		else {
			console.log(`Unable to save the document: ${err}`);

			// gracefully handle err with doc saving
			res.render('announcement-add');
		}
	});

});

app.get('/user/edit/:slug', (req, res) => {
	// block any user that isn't logged in
	if (req.session.user) {
		ANNOUNCEMENTS.findOne({ slug: req.params.slug }, (err, doc) => {
			if (!err) {
				// change all the date/time formats
				const { date, deadline, start_time: startT, end_time: endT } = doc;

				if (startT && startT.length > 0) {
					const arr = startT.split('');
					arr.splice(2, 0, ':');
					doc.start_time = arr.join('');
				}

				if (endT && endT.length > 0) {
					const arr = endT.split('');
					arr.splice(2, 0, ':');
					doc.end_time = arr.join('');
				}

				if (date) {
					const dateJS = new Date(date);
					let newDate = "" + dateJS.getFullYear() + "-";
					if (dateJS.getMonth() < 9) {
						newDate += "0";
					}
					newDate += (dateJS.getMonth() + 1) + "-";
					if (dateJS.getDate() < 9) {
						newDate += "0";
					}
					newDate += (dateJS.getDate() + 1);
					doc.editedDate = newDate;
				}

				if (deadline) {
					const dateJS = new Date(deadline);
					let newDate = "" + dateJS.getFullYear() + "-";
					if (dateJS.getMonth() < 9) {
						newDate += "0";
					}
					newDate += (dateJS.getMonth() + 1) + "-";
					if (dateJS.getDate() < 9) {
						newDate += "0";
					}
					newDate += (dateJS.getDate() + 1);
					doc.editedDeadline = newDate;
				}

				res.render('announcement-edit', { doc });
			}
			else {
				res.redirect('/user');
			}
		});
	}
	else {
		res.redirect('/login');
	}
});

app.post('/user/edit/:slug', (req, res) => {
	// gather data from the body of the posted form
	const { name, location, description, date, startTime: start, endTime: end, deadline, price, districtEvent, promoRequest, promoMaterial } = req.body;
	let startTime, endTime;

	if (start) {
		const timeArr = start.split(':');
		startTime = timeArr.join('');
	}

	if (end) {
		const timeArr = end.split(':');
		endTime = timeArr.join('');
	}

	// find the announcement & save data
	ANNOUNCEMENTS.findOneAndUpdate({ slug: req.params.slug }, { name: name, location: location, desc: description, date: date, start_time: startTime, end_time: endTime, deadline: deadline, price: price, district_event: (districtEvent === "on" ? true : false), promo_request: (promoRequest === "on" ? true : false), promo_material: promoMaterial, editedAt: new Date().toLocaleString() }, (err) => {
		if (!err) {
			res.redirect('/');
		}
		else {
			console.log(`Unable to save the document: ${err}`);

			// gracefully handle err with doc saving
			res.render('announcement-add');
		}
	});
});

app.listen(process.env.PORT || 3000);
console.log('Started server on port 3000');