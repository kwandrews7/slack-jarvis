module.exports = function (robot) {
  robot.hear(/[\s\S]*/, function (msg) {
    
    let originUser = msg.message.user.id;
    let originRoom = msg.message.room;
    
    if (isIgnored(originUser, robot)) {
      return;
    }
    
    let url = getWebhook(originRoom, robot);
    
    if (url === null) {
      robot.logger.debug(`No webhook found for ${originRoom}`);
      return;
    }
    
    let data = JSON.stringify({
      'username': getName(originUser, robot) || msg.message.user.name,
      'content': msg.message.text,
      'avatar_url': getAvatar(originUser, robot)
    });
    
    robot.http(url)
    .header('Content-Type', 'application/json')
    .post(data)(function (err, res, body) {
      if (err) {
        robot.logger.error('Error mirroring to Slack!', err, res, body);
      }  
    });
    
  });
};

function isIgnored(originUser, robot) {
  let matchedUsers = robot.brain.data.chat_sync_users_map.filter( x => x.slackId === originUser);
  if (matchedUsers.length > 0 && !matchedUsers[0].ignored) {
    return false;
  } 
  return true;
}

function getWebhook(originRoom, robot) {
  let matchedRooms = robot.brain.data.chat_sync_rooms_map.filter( x => x.slackId === originRoom);
  robot.logger.debug(matchedRooms, originRoom);
  return (matchedRooms.length > 0) ? matchedRooms[0].discordWebhook : null;
}

function getName(originUser, robot) {
  let matchedUsers = robot.brain.data.chat_sync_users_map.filter( x => x.slackId === originUser);
  return (matchedUsers.length > 0 && matchedUsers[0].slackName.length > 0) ? matchedUsers[0].discordName : null;
}

function getAvatar(originUser, robot) {
  let matchedUsers = robot.brain.data.chat_sync_users_map.filter( x => x.slackId === originUser);
  return (matchedUsers.length > 0 && matchedUsers[0].avatarUrl.length > 0) ? matchedUsers[0].avatarUrl : 'https://i.imgur.com/KE3VppB.png';
}