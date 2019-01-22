const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');


/**
 * USER SCHEMA
 * 
 * usernames are strings
 * passwords are hashes
 */
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    // password hash provided by authentication plugin
    password: { type: String, required: true }
});

mongoose.model('User', userSchema);

/**
 * ANNOUNCEMENT SCHEMA
 * 
 * submitedBy are refs to User objects
 * names are strings
 * locations are strings of addresses
 * dates and deadlines are js date types (strings)
 * start_ and end_times are all date.gettime() (strings)
 * price is a number
 * desc are strings
 * district_events/promo_requests are boolean values
 * promo_material are strings
 * there is a timestamp of the time they are created and edited at
 */
const announcementSchema = new mongoose.Schema({
    submitedBy: { type: String, required: true },
    name: String,
    location: String,
    date: String,
    start_time: String,
    end_time: String /* not required */,
    deadline: String /* not required */,
    price: Number /* not required */,
    desc: String,
    district_event: Boolean,
    promo_request: Boolean,
    promo_material: String,
    createdAt: String /* timestamp */,
    editedAt: String /* timestamp */,
});

// use plugins (for slug)
announcementSchema.plugin(URLSlugs('name', {field: 'slug', separator: '-', update: true }));

mongoose.model('Announcement', announcementSchema);

// TODO: edit the other schema

/**
 * PROMOTIONAL QUEUE SCHEMA
 * 
 * consists of 3 props
 *  announcements are arrays of announcement object references
 *  createdAt is a timestamp of when the queue was creates
 *  editedAt is a timestamp of when the queue was edited
 */
const promoSchema = new mongoose.Schema({
    announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
    createdAt: String /* timestamp */,
    editedAt: String /* timestamp */
});

mongoose.model('PromoQueue', promoSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/final-project';
}

mongoose.connect(dbconf, { useNewUrlParser: true, useCreateIndex: true });