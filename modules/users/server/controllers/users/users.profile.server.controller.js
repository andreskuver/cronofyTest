'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  cronofy = require('cronofy');

/*
 * Request for the acces code and make a request for a token
 * Response Params: code state
 */
exports.getCodeCronofy = function (req, res) {

  var code = req.query.code;
  
  var optionsAut = {
    client_id: 'Vp3tb9LgZlwchEcR4TkNuUtQN0TBCR2n',
    client_secret: 'ZBo4VWOY2mkMvkk6wuh9Sl1TJThQ4Bv7GWv2YCOGXVZWHkBKwuIZOjrEwE70hlU7w88RPCKPkA-fbjMqdf6Tbg',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'http://localhost:3000/api/users/authCronofy'
  };
 
  cronofy.requestAccessToken(optionsAut)
    .then(function(response){
      console.log(response);
    }, function(err) {
      console.log(err);
    });
}

exports.requestTokenCronofy = function (req, res) {
  console.log("RESPONSE :", req);
}
/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
