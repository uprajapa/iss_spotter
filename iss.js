const request = require('request');
const URL = 'https://api.ipify.org';

let ip = "";
let urlForIp = 'http://ipwho.is/';

const fetchMyIP = function(callback) {
  return new Promise((resolve, reject) => {
    request(URL, (error, response, body) => {
      if (error) {
        callback(error, null);
        return reject();
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return reject();
      }
      ip = body; // Got our IP!
      callback(null, ip);
      return resolve();
    });
  });
};

const fetchCoordsByIP = function(callback) {
  return new Promise((resolve, reject) => {
    request(`${urlForIp}42`, (error, response, body) => {
      // console.log(`ip: ${body}`);
      let data = JSON.parse(body);
      let geoLocation = {};

      if (!data.success) {
        return reject(`It didn't work! Error: Success status was false. Server message says: Invalid IP address when fetching for IP ${ip}`);
      }
      if (error) {
        console.log(`Error: ${error}`);
        callback(error, null);
        return reject();
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return reject();
      }
      
      geoLocation['latitude'] = data.latitude;
      geoLocation['longitude'] = data.longitude;
      callback(null, geoLocation);
      return resolve();
    });
  });
};

/* fetchMyIP()
  .then(fetchCoordsByIP)
  .catch((err) => console.log(`Something wrong: ${err}`)); */

module.exports = { fetchMyIP, fetchCoordsByIP };