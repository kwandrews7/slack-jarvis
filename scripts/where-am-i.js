const os = require('os');

function sendServerLoc(msg) {
  console.log(`where-am-i called`);
  msg.http(`http://ip-api.com/json`).get()(function (err, res, body) {
    let _body = JSON.parse(body);
    if (_body.city && _body.regionName) {
      msg.send(`${_body.city}, ${_body.regionName} [${os.hostname()}]`);
    }
    if (_body.lat && _body.lon) {
      msg.send(`https://www.google.com/maps/search/?api=1&query=${_body.lat},${_body.lon}`);
    }
  });
}

module.exports = function (robot) {
  robot.respond(/where are you/i, message => sendServerLoc(message));
  robot.respond(/where you at/i, message => sendServerLoc(message));
};
