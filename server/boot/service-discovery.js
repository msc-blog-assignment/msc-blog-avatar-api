'use strict';

const consul = require('consul');
const packageJson = require('../../package');
const cfenv = require('cfenv');
const {getEnv} = require('../utils/service-discovery');

const appEnv = cfenv.getAppEnv();

module.exports = () => {
  let {host, port, secure} = getEnv();

  const discoveryService = consul({host, port, secure, promisify: true});

  return discoveryService.agent.service.register({
    name: packageJson.name,
    address: appEnv.isLocal ? process.env.HOSTNAME : appEnv.url
  });
};
