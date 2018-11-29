const hearRegex = /swing and a miss/i;
const responses = [
  'http://i.imgur.com/vptivZ3.gifv',
  'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/18222304_10211347681121323_3605427431777126709_n.jpg?oh=d187f283087c3db231b637a4869138ba&oe=59B5D9E5',
  'http://ksj130.org/images/Swing%20and%20a%20miss.jpg',
  'http://www.totalprosports.com/wp-content/uploads/2010/11/soccer-miss.gif',
  'http://memeguy.com/photos/thumbs/bad-practice-on-girls-head-191215.gif',
  'https://img.memecdn.com/a-swing-and-a-miss_o_243967.gif',
  'http://i0.kym-cdn.com/photos/images/newsfeed/000/916/035/226.gif',
  'http://i.imgur.com/q7sDL5q.gif',
  'https://media.giphy.com/media/xT4uQq7d4BE4GCkkBW/giphy.gif',
  'http://iruntheinternet.com/lulzdump/images/gifs/fruit-ninja-IRL-swing-and-a-miss-fruit-hits-face-sword-13560549801.gif?id=',
  'http://i.imgur.com/RenLddC.gifv',
  'https://i.gifer.com/3b42.gif'
];


module.exports = function (robot) {

  robot.hear(hearRegex, function (message) {
    message.send(responses[Math.floor(Math.random() * responses.length)]);
  });

};
