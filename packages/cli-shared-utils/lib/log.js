const { inspect } = require('util');

exports.logInspect = (data) => {
  return console.log('logInspect: ', inspect(data, false, null, true));
}