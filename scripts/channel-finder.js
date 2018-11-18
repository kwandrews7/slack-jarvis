module.exports = function (robot) {
  robot.respond(/what channel is this/i, message => message.send(message.message.room));
};
