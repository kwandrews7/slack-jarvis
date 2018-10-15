const responses = [
  'http://i.imgur.com/JA6Uu.gif',
  'http://i.imgur.com/UdP1L.gif'
];

module.exports = function (robot) {

  robot.hear(/i(\u0027|\u2019)?m out$/i, message =>
    message.send(responses[Math.floor(Math.random() * responses.length)]));

};
