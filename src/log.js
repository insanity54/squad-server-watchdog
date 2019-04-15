
var spawn = require('child_process').spawn;

var tail = spawn("journalctl", ["-x", "-f"]);

http = require('http');
http.createServer(function (req, res) {
  console.log("new connection..");
  res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
  tail.stdout.on("data", function (data) {
    res.write(data);
  });
}).listen(3000);
