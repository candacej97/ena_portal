const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const USER = mongoose.model('users');

function register(username, password, errorCallback, successCallback) {
  // if the username or password is too short, call the errorCallback
  if (username.length < 8 || password.length < 8) {
    errorCallback({ message: "Username/Password entered is too short" });
  }

  // check if the user already exists
  USER.findOne({ username: username }, (err, result) => {
    if (result) {
      errorCallback({ message: "Username already exists." });
    }
    else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          new USER({ username: username, password: hash }).save((err, savedUser) => {
            if (err) {
              errorCallback({ message: "There was an error saving the registered user." });
            }
            if (savedUser) {
              successCallback(savedUser);
            }
          });    
        });
      });
    }
  });
}

function login(username, password, errorCallback, successCallback) {
  USER.findOne({ username: username }, (err, user) => {
    if (!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (passwordMatch) {
          successCallback(user);
        }
        else {
          errorCallback({ message: "Passwords do not match." });
        }
      });
    }
    else {
      errorCallback({ message: "Username not found." });
    }
  });
}

function startAuthenticatedSession(req, user, cb) {
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user;
      cb();
    }
    else {
      console.log(`ERROR: ${err}`);
      cb(err);
    }
  });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
