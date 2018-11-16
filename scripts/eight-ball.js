const hearRegex = /^(8ball|8-ball|8 ball)/i;
const responses = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it - yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Wouldn\'t you like to know?',
  'Insert 25 cents and try again',
  'Better not tell you now',
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
  'Good luck'
];


module.exports = function (robot) {

  robot.hear(hearRegex, function (message) {
    message.send(responses[Math.floor(Math.random() * responses.length)]);
  });

};
