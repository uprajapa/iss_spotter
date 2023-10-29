const request = require('request');
const URL = 'https://api.ipify.org';

let ip = "";
let urlForIp = 'http://ipwho.is/';
const geoLocation = {};
let flyOverTimes = [];

const fetchMyIP = function() {
  return new Promise((resolve, reject) => {
    request(URL, (error, response, body) => {
      if (error) {
        // callback(error, null);
        return reject(`Error fetching Ip addess: ${error}`);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        // callback(Error(msg), null);
        return reject(msg);
      }
      ip = body; // Got our IP!
      // callback(null, ip);
      return resolve(`IP fetched: ${ip}`);
    });
  });
};

const fetchCoordsByIP = function() {
  return new Promise((resolve, reject) => {
    const URLFORIP = urlForIp + ip;
    request(URLFORIP, (error, response, body) => {
      let data = JSON.parse(body);

      if (!data.success) {
        return reject(`Error: Success status was false. Server message says: Invalid IP address when fetching for IP ${ip}`);
      }
      if (error) {
        return reject(error);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        return reject(msg);
      }
      
      geoLocation['latitude'] = data.latitude;
      geoLocation['longitude'] = data.longitude;
      return resolve(`Geolocation fetched: ${geoLocation}`);
    });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function() {
  return new Promise((resolve, reject) => {
    const URL = `https://iss-flyover.herokuapp.com/json/?lat=${geoLocation.latitude}&lon=${geoLocation.longitude}`;
    request(URL, (error, response, body) => {
      console.log(`Response: ${response.statusCode}: ${response}`);
      if (response.statusCode === 400) {
        return reject(`Invalid url for fetchISSFlyOverTimes`);
      }
      if (error || response.statusCode !== 200) {
        return reject(`Error: ${error}`);
      }
      
      let data = JSON.parse(body);
      flyOverTimes = data.response;
      // console.log(`Data.response: ${data['response']}`);
      return resolve(`Response fetched with ${response.statusCode} code: ${flyOverTimes}`);
    });
  });
};

const nextISSTimesForMyLocation = function() {
  let msg = "";

  let convertTimeZone = function(time) {
    let date = new Date(time * 1000);
    return date;
  };

  return new Promise((resolve, reject) => {
    if (flyOverTimes.length === 0) {
      return reject(`No data found!`);
    }
    for (let times of flyOverTimes) {
      let time = convertTimeZone(times.risetime);
      msg += `\nNext pass at: ${time} for ${times.duration} seconds!`;
    }
    return resolve(msg);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };