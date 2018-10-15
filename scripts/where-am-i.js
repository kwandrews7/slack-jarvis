const os = require('os');
const hostname = os.hostname().includes('Kyle-Andrews-MacBook-Pro') ? 'Chilling with @kwandrews7 :mustang:' : 'Hanging out in the Cloud :cloud:';

module.exports = robot =>
  robot.respond(/where are you/i, message => message.send(hostname))
;
