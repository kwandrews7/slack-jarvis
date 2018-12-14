// Commands:
//   jarvis weekly stats (yyyy-mm-dd) - Provide weekly stats. (Date optional)
//   jarvis daily stats (yyyy-mm-dd) - Provide daily stats. (Date optional)


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

      robot.respond(/(give us the stats|weekly stats)( )?([0-9]{4}-[0-9]{2}-[0-9]{2})?/i, function (msg) {
        var content = {};

        let dateStr = msg.match[3] || new Date().toISOString().substr(0, 10);
        let endTime = new Date(dateStr + 'T00:00:00+00:00');
        let startTime = new Date(endTime - (7 * 24 * 60 * 60 * 1000));
        content.start = startTime.toUTCString();
        content.end = endTime.toUTCString();
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


      robot.respond(/daily stats( )?([0-9]{4}-[0-9]{2}-[0-9]{2})?/i, function (msg) {
        let content = {};
        content.roomCounts = [];
        
        let dateStr = msg.match[2] || new Date().toISOString().substr(0, 10);
        let startTime = new Date(dateStr + 'T00:00:00+00:00');
        let endTime = new Date(dateStr + 'T23:59:59+00:00');
        
        content.start = startTime.toUTCString();
        content.end = endTime.toUTCString();
        let timestampQuery = {
          $gte: startTime.getTime(),
          $lte: endTime.getTime()
        };

        getMessageCount(collection, timestampQuery, function (error, result) {
          content.messageCount = result || -1;
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
  let userPipeline = [{
      $match: {
        timestamp: timestampQuery
      }
    },
    {
      $group: {
        _id: "$user",
        count: {
          $sum: 1
        }
      }
    }];
  collection.aggregate(userPipeline).toArray(callback);
}

function getRoomsAggregate(collection, timestampQuery, callback) {
  let roomPipeline = [{
      $match: {
        timestamp: timestampQuery
      }
    },
    {
      $group: {
        _id: "$room",
        count: {
          $sum: 1
        }
      }
    }];
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
    response.push('*Messages Statistics*');
    response.push(`_${content.start} - ${content.end}_`);
    response.push(`*Total Message Count:* _${content.messageCount}_`);
    if (content.userCounts.length > 0) {
      response.push(`*Stats by User:*`);
      content.userCounts.sort(compareAggregateResults).forEach(function (user, index) {
        response.push(`_${index+1}. ${user._id}: ${user.count} ${optionalMedal(index)}_`);
      });
    }
    if (content.roomCounts.length > 0) {
      response.push(`*Stats by Room:*`);
      content.roomCounts.sort(compareAggregateResults).forEach(function (room, index) {
        response.push(`_${index+1}. ${room._id}: ${room.count} ${optionalMedal(index)}_`);
      }); 
    }
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
