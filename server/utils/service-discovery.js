'use strict';

const consul = require('consul');
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

function getEnv() {
  let host = '';
  let port = '';
  let secure = false;

  if (appEnv.isLocal) {
    const {SERVICE_DISCOVERY_HOST, SERVICE_DISCOVERY_PORT} = process.env;

    host = SERVICE_DISCOVERY_HOST;
    port = SERVICE_DISCOVERY_PORT;
  } else {
    const service = appEnv.getService('consul-service-discovery');

    host = service.credentials.host;
    port = service.credentials.port;
    secure = service.credentials.secure;
  }

  return {host, port, secure};
}

function getServices() {
  let {host, port, secure} = getEnv();
  return consul({host, port, secure, promisify: true}).agent.service.list();
}

module.exports = {
  getEnv,
  getServices
};
