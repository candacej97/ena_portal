# Data Model

The application will store users, announcements, and a promotional queue in a **_MongoDB_** database.

* Announcements can have one user associated to each one (via references)
* The Promotional Queue will contain multiple announcements (via references) based on the `promo_request` property in the announcement's doc in the database.

## User Schema

```js
new mongoose.Schema({
    // username validation is to be any alphanumeric char 8 char or more in length
    username: { type: String, unique: true, required: true, validate: RegExp(/\w{8,}/) },
    // password hash provided by authentication plugin
    password: { type: String, required: true }
});
```

### An Example User

```js
{
  username: "johndoe1",
  password: /* a password hash */
}
```

## Announcement Schema

```js
new mongoose.Schema({
    submitedBy: { type: ObjectId, ref: 'user', required: true },
    name: {type: String, required: true},
    location: {type: String, required: true},
    date: {type: Date, required: true},
    start_time: {type: String, required: false}, /* time as a 24-hr formatted string */
    end_time: {type: String, required: false},
    deadline: Date,
    price: Number,
    desc: {type: String, required: true},
    district_event: {type: Boolean, default: false},
    promo_request: {type: Boolean, default: false},
    promo_material: String,
    createdAt: {type: Date, default: Date.now()} /* timestamp */,
    editedAt: Date /* timestamp */
});
```

### An Example Announcement:

```js
{
  submitedBy: /* an ObjectId */ ,
  name: "Heritage",
  location: "UAC",
  date: "Wed Feb 06 2019 20:00:00 GMT-0500 (Eastern Standard Time)" /* Date object */,
  start_time: "1200",
  end_time: "1500",
  deadline: null ,
  price: 20,
  desc: "This event celebrates the stalwarts and long-time followers of the Apostolic doctrine.",
  district_event: false,
  promo_request: true,
  promo_material: "",
  createdAt: "Mon Nov 01 2018 12:14:21 GMT-0500 (Eastern Standard Time)" /* timestamp */,
  editedAt: "Mon Nov 01 2018 14:49:01 GMT-0500 (Eastern Standard Time)" /* timestamp*/
}
```

## Promo Queue Schema

```js
new mongoose.Schema({
    announcements: [{ type: ObjectId, ref: 'List' }],
    createdAt: Date, /* timestamp */
    editedAt: Date /* timestamp */
});
```

### An Example Promotional Queue:

```js
{
  announcements: [
    /* references to Announcement docs using ObjectIds */
  ],
  createdAt: "Mon Nov 01 2018 14:54:16 GMT-0500 (Eastern Standard Time)" /* timestamp */,
  editedAt: "Mon Nov 01 2018 18:21:20 GMT-0500 (Eastern Standard Time)" /* timestamp */
}
```