const http = require('http');
const OC = require('./oc');

const ROUTE = 'http://' + OC.getDemoAppRoute();

exports.check = function(level, callbackFn) {
  http.get(ROUTE + '/index.json', (resp) => {
    let body = "";
    if(resp.statusCode === 200) {
      resp.on('data', data => {
        body += data;
      });
      resp.on("end", () => {
        body = JSON.parse(body);
        callbackFn(body.level === level);
      });
    } else {
      callbackFn(false);
    }
  });
}