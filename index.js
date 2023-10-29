const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP()
  .then((msg) => console.log(msg))
  .then(fetchCoordsByIP)
  .then((msg) => console.log(msg))
  .then(fetchISSFlyOverTimes)
  .then((msg) => console.log(msg))
  .then(nextISSTimesForMyLocation)
  .then((msg) => console.log(msg))
  .catch((err) => console.log(`It didn't work! ${err}`));