const { v4: uuidv4 } = require('uuid');

function genUserIds(n) {
  return Array.from({ length: n }, () => uuidv4());
}

exports.userIds = genUserIds(1000);
