const Promise = require("bluebird");
var request = Promise.promisify(require("request"), { multiArgs: true });
Promise.promisifyAll(request, { multiArgs: true });
var postRequest = Promise.promisify(require("request").post, { multiArgs: true });
Promise.promisifyAll(postRequest, { multiArgs: true });

module.exports = {request, postRequest};