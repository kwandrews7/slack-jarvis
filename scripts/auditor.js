const Util = require("util");
const MongoClient = require('mongodb').MongoClient;
const ignoredRooms = ["G6RRY5L5B", "D03M55E30"];
const roomMap = {
  "C0D2Z96AG": "hubot-testing",
  "C03AFTJHG": "general",
  "C4YTEUTJ6": "generaltsos",
  "CCE6AE5GE": "investing",
  "CEFH3HW1M": "whatsplaying"
};

module.exports = function (robot) {

  MongoClient.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true
    },
    function (err, client) {
      if (err) {
        robot.logger.error("Auditor was unable to connect to slack_messages connection!");
        robot.logger.error(err);
      }

      robot.logger.debug('Successfully authenticated with mongo');

      let db = client.db(process.env.MONGODB_DBNAME);
      let collection = db.collection('slack_messages');

      robot.hear(/^.*$/, function (msg) {
        let savedMessage = {
          "room": roomMap[msg.message.room],
          "room_id": msg.message.room,
          "user": msg.message.user.name,
          "user_id": msg.message.user.id,
          "message_id": msg.message.id,
          "text": msg.message.text,
          "timestamp": Date.now()
        };
        if (ignoredRooms.indexOf(savedMessage.room_id) > -1) {
          robot.logger.info("Skipping messages from ignored room.");
          return;
        }
        collection.save(savedMessage, function (err, res) {
          if (err) {
            robot.logger.error("Auditor was unable to save message!");
            robot.logger.error(err);
          }
        });
      });
    });
};
