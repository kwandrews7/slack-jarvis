const hearRegex = /^(9ball|9-ball|9 ball)/i;
const responses = [
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
