const hearRegex = /^(8ball|8-ball|8 ball|9ball|9-ball|9 ball)/i;
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
  'Good luck',
  'I\'d give it 4,000 to 1 against',
  'I predict winnings for people betting against',
  'As If',
  'Ask Me If I Care',
  'Dumb Question Ask Another',
  'Forget About It',
  'Get A Clue',
  'In Your Dreams',
  'Not',
  'Not A Chance',
  'Obviously',
  'Oh Please, Sure',
  'That\'s Ridiculous',
  'Well Maybe',
  'What Do You Think?',
  'Whatever',
  'Who Cares?',
  'Yeah And I\'m The Pope',
  'Yeah Right',
  'You Wish',
  'You\'ve Got To Be Kidding...'
];


module.exports = function (robot) {

  robot.hear(hearRegex, function (message) {
    message.send(responses[Math.floor(Math.random() * responses.length)]);
  });

};
