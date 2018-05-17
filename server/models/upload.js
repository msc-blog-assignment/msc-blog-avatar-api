'use strict';

const {getFileFromRequest} = require('../utils/upload');
const {getServices} = require('../utils/service-discovery');

module.exports = Upload => {
  Upload.upload = (userId, req, next) => {
    let avatar = Upload.app.models.Avatar;

    getServices()
      .then((services) => getFileFromRequest(req, userId, services['msc-blog-upload-api']))
      .then((file) => {
        avatar.upsert({userId, avatar: file.link}, (err, file) => {
          next(err, file);
        });
      })
      .catch((err) => next(err, 'Unable to upload image'));
  };

  Upload.sharedClass.methods().forEach(method => {
    Upload.disableRemoteMethodByName(method.name);
  });

  Upload.remoteMethod('upload', {
    accepts: [
      {arg: 'userId', type: 'string', required: true},
      {arg: 'req', type: 'object', http: {source: 'req'}}
    ],
    returns: {root: true, type: 'object'},
    http: {path: '/upload', verb: 'post'}
  });
};
