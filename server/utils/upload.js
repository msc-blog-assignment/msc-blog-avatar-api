'use strict';

const multiparty = require('multiparty');
const request = require('request');
const _ = require('lodash');

const getFileFromRequest = (req, userId, uploadUrl) => new Promise((resolve, reject) => {
  const form = new multiparty.Form();

  form.on('part', part => {
    if (part.filename) {
      request({
        method: 'POST',
        url: uploadUrl.Address,
        qs: {
          userId
        },
        formData: {
          file: {
            value: part,
            options: {
              filename: part.filename,
              contentType: part['content-type'],
              knownLength: part.byteCount
            }
          }
        },
        headers: {
          'content-encoding': 'chunked'
        }
      }, (err, httpResponse, body) => {
        err ? reject(err) : resolve(JSON.parse(body));
      });
    }
  });

  form.on('error', (err) => {
    reject(err);
  });

  form.parse(req);
});

module.exports = {
  getFileFromRequest
};
