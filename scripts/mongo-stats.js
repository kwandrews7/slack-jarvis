const MongoClient = require('mongodb').MongoClient;
const roomMap = {
  'C0D2Z96AG': 'hubot-testing',
  'C03AFTJHG': 'general',
  'C4YTEUTJ6': 'generaltsos',
  'CCE6AE5GE': 'investing',
  'CEFH3HW1M': 'whatsplaying'
};

module.exports = function (robot) {

  MongoClient.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true
    },
    function (err, client) {
      if (err) {
        robot.logger.error('MongoStats was unable to connect to slack_messages connection!');
        robot.logger.error(err);
      }

      robot.logger.debug('MongoStats - Successfully authenticated with mongo');

      let db = client.db(process.env.MONGODB_DBNAME);
      let collection = db.collection('slack_messages');

      robot.respond(/(give us the stats|what are the stats)/i, function (msg) {
        var content = {};

        let endTime = new Date();
        endTime.setUTCHours(0, 0, 0);
        let startTime = new Date(endTime - (7 * 24 * 60 * 60 * 1000));
        content.start = startTime.toDateString();
        content.end = endTime.toDateString();
        let timestampQuery = {
          $gte: startTime.getTime(),
          $lte: endTime.getTime()
        };

        getMessageCount(collection, timestampQuery, function (error, result) {
          content.messageCount = result || -1;
          respondWithContent(msg, content);
        });
        
        getRoomsAggregate(collection, timestampQuery, function (error, result) {
          content.roomCounts = result || [];
          respondWithContent(msg, content);
        });
        
        getUsersAggregate(collection, timestampQuery, function (error, result) {
          content.userCounts = result || [];
          respondWithContent(msg, content);
        });

      });
    });
};

function getUsersAggregate(collection, timestampQuery, callback) {
  let userPipeline = [{ $match: { timestamp: timestampQuery } },
    { $group: { _id: "$user", count: { $sum: 1 } } }];
  collection.aggregate(userPipeline).toArray(callback);
}

function getRoomsAggregate(collection, timestampQuery, callback) {
  let roomPipeline = [{ $match: { timestamp: timestampQuery } },
    { $group: { _id: "$room", count: { $sum: 1 } } }];
  collection.aggregate(roomPipeline).toArray(callback);
}

function getMessageCount(collection, timestampQuery, callback) {
  let query = {
    timestamp: timestampQuery
  };
  collection.countDocuments(query, {}, callback);
}

function respondWithContent(robot, content) {
  if (robot && content && content.start &&
    content.end && content.messageCount &&
    content.roomCounts && content.userCounts) {
    var response = [];
    response.push('*Last Week Messages Statistics*');
    response.push(`*Timeframe:* _${content.start} - ${content.end}_`);
    response.push(`*Total Message Count:* _${content.messageCount}_`);
    response.push(`*Stats by User:*`);
    content.userCounts.sort(compareAggregateResults).forEach(function(user, index) {
      response.push(`_${index+1}. ${user._id}: ${user.count} ${optionalMedal(index)}_`);
    });
    response.push(`*Stats by Room:*`);
    content.roomCounts.sort(compareAggregateResults).forEach(function(room, index) {
      response.push(`_${index+1}. ${room._id}: ${room.count} ${optionalMedal(index)}_`);
    });
    robot.send(response.join('\n'));
  }
}

function compareAggregateResults(a, b) {
  return b.count - a.count;
}

function optionalMedal(index) {
  if (index === 0) {
    return ':gold:';
  } else if (index === 1) {
    return ':silver:';
  } else if (index === 2) {
    return ':bronze:';
  } else {
    return '';
  }
}