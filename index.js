const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP()
  .then(fetchCoordsByIP)
  .catch((err) => console.log(`It didn't work! ${err}`));