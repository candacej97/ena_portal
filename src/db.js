const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const ObjectId = mongoose.Schema.Types.ObjectId;

// USER SCHEMA
const userSchema = new mongoose.Schema({
    // username validation is to be any alphanumeric char 8 char or more in length
    username: { type: String, unique: true, required: true, validate: RegExp(/\w{8,}/) },
    // password hash provided by authentication plugin
    password: { type: String, required: true }
});

mongoose.model('users', userSchema);

// ANNOUNCEMENT SCHEMA
const announcementSchema = new mongoose.Schema({
    submitedBy: { type: ObjectId, ref: 'user', required: true },
    name: {type: String, required: true},
    location: String,
    date: {type: Date, required: true},
    start_time: Date,
    end_time: Date,
    deadline: Date,
    price: Number,
    desc: String,
    district_event: Boolean,
    promo_request: Boolean,
    promo_material: String,
    promoFiles: File,
    createdAt: Date /* timestamp */,
    editedAt: Date /* timestamp */,
});

// use plugins (for slug)
announcementSchema.plugin(URLSlugs('name', {field: 'slug', separator: '-', update: true }));
mongoose.model('announcements', announcementSchema);

// PROMOTIONAL QUEUE SCHEMA
// fixme can validate handle checking another schema for a flag?
const promoSchema = new mongoose.Schema({
    announcements: [{ type: ObjectId, ref: 'List' }],
    createdAt: Date, /* timestamp */
    editedAt: Date /* timestamp */
});

mongoose.model('promos', promoSchema);

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
 dbconf = 'mongodb://localhost/ena_portal';
}

mongoose.connect(dbconf, { useNewUrlParser: true, useCreateIndex: true });