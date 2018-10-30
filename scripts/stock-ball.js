const hearRegex = /(stockball|stock-ball|stock ball|investball|invest-ball|invest ball)/i;
const responses = [
  "Bear Market Ahead",
  "Bull Market Ahead",
  "Buy Now",
  "Buy Pork Bellies",
  "Buy Real Estate",
  "Buy T-Bills",
  "Change Brokers",
  "Don't Buy on Margin",
  "Go for It",
  "One Word: Plastics",
  "Out to Lunch",
  "Pay Off Loans First",
  "Ride it Out",
  "Sell Half Now",
  "Sell Now",
  "Sell Real Estate",
  "Start Own Business",
  "Tech Stocks Hot",
  "Think Precious Metals",
  "HODL!"
];


module.exports = function (robot) {

  robot.hear(hearRegex, function (message) {
    message.send(responses[Math.floor(Math.random() * responses.length)]);
  });

};
