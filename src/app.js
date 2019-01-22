const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const validate = require('./validate');
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
const Announcement = mongoose.model('Announcement');
// const User = mongoose.model('User');
// TODO: un-comment the following line
// const PromoQueue = mongoose.model('PromoQueue');

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // 

app.get('/', (req, res) => {
	if (req.session.user) {
		res.redirect('/user');
	}
	else {
		// get all announcements and render them on this page
		Announcement.find({}, (err, docs) => {
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
	res.render('register');
});

app.post('/register', (req, res) => {
	// get all input
	const {username, password} = req.body;
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
	res.render('login');
});

app.post('/login', (req, res) => {
	const {username, password} = req.body;
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

app.get('/user', (req, res) => {
	// block any user that isn't logged in
    if (req.session.user) {
		// find all announcments that are associated with the user
		Announcement.find({ submitedBy: req.session.user.username }, (err, docs) => {
			if (!err) {
				res.render('user-home', { announcements: docs });
			}
			else {
				res.render('user-home', { message: "There was an error finding your submissions." });
			}
		});
    }
    else {
        res.redirect('/login');
    }
});

app.get('/user/add', (req, res) => {
	res.render('announcement-add');
});

app.post('/user/add', (req, res) => {
	// retrieve all form input from rendered page
	const {name, location, date, startTime, endTime, deadline, price, desc, districtEvent, promoRequest, promoMaterial} = req.body;
	// validate form data
	const errors = validate.validateAnnouncementFields(req.body);
	if (errors.count > 0) {
		// console.log(`REQ BODY: ${JSON.stringify(req.body)}`);
		
		// re-render page with error messages
		res.render('announcement-add', { errors });
	}
	else {
		// create a timestamp
		const createdAt = new Date().toLocaleString();

		// add to db
		new Announcement({ submitedBy: req.session.user.username, name: name, location: location, date: date, start_time: startTime, end_time: endTime, deadline: deadline, price: price, desc: desc, district_event: districtEvent, promo_request: promoRequest, promo_material: promoMaterial, createdAt: createdAt }).save((err) => {
			if (!err) {
				res.redirect('/');
			}
			else {
				console.log(`Unable to save the document: ${err}`);

				// gracefully handle err with doc saving
				res.render('announcement-add');
			}
		});
	}
});

app.get('/user/edit/:slug', (req, res) => {
	Announcement.findOne({ slug: req.params.slug }, (err, doc) => {
		if (!err) {
			res.render('announcement-edit', { doc });
		}
		else {
			res.render('announcement-edit', { message: "Unable to find the event."});
		}
	});
});

app.post('/user/edit/:slug', (req, res) => {
	// NOTE change editedAt to new Date().toLocaleString()
	
});

app.listen(process.env.PORT || 3000);
console.log('Started server on port 3000');