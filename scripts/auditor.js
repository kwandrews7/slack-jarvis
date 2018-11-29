const Util = require("util");
const MongoClient = require('mongodb').MongoClient;
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
        let room = msg.message.room;
        if (room.startsWith('G') || room.startsWith('D')) {
          robot.logger.info("Skipping messages from ignored room.");
          return;
        }
        let savedMessage = {
          "room": roomMap[room],
          "room_id": room,
          "user": msg.message.user.name,
          "user_id": msg.message.user.id,
          "message_id": msg.message.id,
          "text": msg.message.text,
          "timestamp": Date.now()
        };
        collection.insertOne(savedMessage, function (err, res) {
          if (err) {
            robot.logger.error("Auditor was unable to save message!");
            robot.logger.error(err);
          }
        });
      });
    });
};
