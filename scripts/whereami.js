const os = require('os');
const hostname = os.hostname();

module.exports = robot =>
  robot.respond(/where are you/i, message => message.send(hostname))
;
