# Events and Announcements (ENA) Portal
<!-- todo change data model to match current model used -->
A web app boilerplate for keeping track of all events and announcements for an organization and displaying them to public users, and allowing admin users to accept requests to host and/or promote events.

## Overview

Running and organization is one thing, getting an organization to be organized is a job in itself. The ENA Portal is a web app for keeping track of all events and announcements for an organization, displaying them, accepting requests to host and/or promote events.

Users are able to view announcements (general or event-based) without logging in. However, if they wish to submit/edit an event (editing of events they submitted), they must sign up/log in. Each event will include statuses of whether they have been approved by the admin office as a viable date to hold the event, or included in the promotional queue. 

<!-- Admins who log into the site will have a different view. They will be able to see all announcements and be able to approve or deny the request, put events on postponement with a note of details, and see/edit the announcement queue (based on the admin status).  -->

## Features

<!-- * admin panel - create (or add custom) rsvp codes to db -->
* use a config file for db security

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Node
* NPM
* MongoDB

### Installing

```
git clone https://github.com/candacej97/ena_portal.git
cd ena_portal
npm install
npm start
```

## Testing

go to your browser and go to `localhost:3000`

## Built With

* NodeJS
    * express
    * express-session
    * mongoose
    * mongoose-url-slugs
    * hbs
    * path
    * bcryptjs
* MongoDB

## Wireframes

![Public Homepage of the ENA Portal as of 11/07/18](docs/img/home.png?raw=true "Public Homepage of the ENA Portal as of 11/07/18")

![Sign Up page of the ENA Portal as of 11/07/18](docs/img/sign_up.png?raw=true "Sign Up page of the ENA Portal as of 11/07/18")

![Sign In page of the ENA Portal as of 11/07/18](docs/img/sign_in.png?raw=true "Sign In page of the ENA Portal as of 11/07/18")

![User homepage of the ENA Portal as of 11/07/18](docs/img/user_homepage.png?raw=true "User homepage of the ENA Portal as of 11/07/18")

![Add announcement page of the ENA Portal as of 11/07/18](docs/img/add_announcement.png?raw=true "Add announcement page of the ENA Portal as of 11/07/18")

![Edit announcement page of the ENA Portal as of 11/07/18](docs/img/edit_announcement.png?raw=true "Edit announcement page of the ENA Portal as of 11/07/18")

## Site Map

![Site Map of the ENA Portal as of 11/07/18](docs/img/site_map.png?raw=true "Site Map of the ENA Portal as of 11/07/18")

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as non-registered user, I can view all the announcements that have been approved by an admin
3. as a user, I can log in to the site
4. as a user, I can submit a new announcement form
5. as a user, I can view all of the announcement forms I've submitted
6. as a user, I can edit my submitted announcement forms
7. as an admin user, I can approve, deny or postpone/delay submitted announcement forms for live view

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgements

* [ExpressJS-Session](https://github.com/expressjs/session) - [my code (line 7-12)](src/app.js#L7)

<!-- * [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this) -->