'use strict';

const {createReadStream} = require('fs');
const multiparty = require('multiparty');
const _ = require('lodash');

const getFileFromRequest = (req) => new Promise((resolve, reject) => {
  const form = new multiparty.Form();

  form.on('part', part => {
    if (part.filename) {
      const FormData = require('form-data');
      const request = require('request');
      const form = new FormData();

      form.append('file', part, {filename: part.filename});

      /* const r = request.post('http://localhost:3001/api/uploads/upload?userId=test',
        {'headers': {'transfer-encoding': 'chunked'}},
        (err, res, body) => {
          console.log(res);
          err ? reject(err) : resolve(body);
        });
        r._form = form;
        */

      request.post({
        url: 'http://localhost:3001/api/uploads/upload?userId=test',
        form
      }, function (err, res, body) {
        console.log(res);
        err ? reject(err) : resolve(body);
      });
    }
  });

  form.parse(req);
});

module.exports = {
  getFileFromRequest
};
