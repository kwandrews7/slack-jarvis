const mongodb = require('mongodb');
const dbUrl = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DBNAME;
const dbCollection = 'slack_brain';

module.exports = function(robot) {
  robot.logger.info('mongodb-brain Connecting to `%s`...', dbUrl);
  var db;
  var collection;

  mongodb.connect(dbUrl, function(err, client) {
    if (err) {
      robot.logger.error('mongodb-brain Connection failed: `%s`', err.message);
      robot.logger.error(err.stack);
      return;
    }
    
    db = client.db(dbName);

    db.collection(dbCollection).findOne({
      _id: 'brain'
    }, function(_err, doc) {
      if (_err) {
        robot.logger.error('mongodb-brain Lookup failed');
        robot.logger.error(_err.stack);
        return;
      }
      if (doc) {
        robot.logger.info('mongodb-brain loaded brain from previous document');
        robot.logger.debug('mongodb-brain %s', JSON.stringify(doc, null, 2));
        robot.brain.mergeData(doc);
      } else {
        robot.logger.info('mongodb-brain Initializing...');
        robot.brain.mergeData({});
      }
      robot.brain.resetSaveInterval(30);
      robot.brain.setAutoSave(true);
      robot.logger.info('mongodb-brain Ready.');
    });
  });

  robot.brain.on('save', function(data) {
    data = data || {};
    data._id = 'brain';
    robot.logger.info('mongodb-brain saving...');
    robot.logger.debug('mongodb-brain %s', JSON.stringify(data, null, 2));

    db.collection(dbCollection).save(data, function(err) {
      if (err) {
        robot.logger.error('mongodb-brain Save failed: `%s`', err.message);
        return;
      }
      robot.logger.info('mongodb-brain Saved!');
    });
  });

  robot.brain.on('close', function() {
    if (db) {
      robot.logger.info('mongodb-brain Closing client.  Goodbye.');
      db.close();
    }
  });

  robot.brain.setAutoSave(false);
};