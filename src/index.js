require('dotenv').config();


const nunjucks = require('nunjucks');
const os = require('os');
const ifaces = os.networkInterfaces();
const path = require('path');
const templateDir = path.join(__dirname, 'views');
const fs = require('fs');

const squadServerQueryPort = process.env.SQUAD_SERVER_QUERY_PORT;
const squadServerPort = process.env.SQUAD_SERVER_PORT;
const squadServerWatchdogPort = process.env.SQUAD_SERVER_WATCHDOG_PORT;

console.log(`squadServerQueryPort:${squadServerQueryPort}. squadServerPort: ${squadServerPort}, SQUAD_SERVER_WATCHDOG_PORT: ${squadServerWatchdogPort}`);

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


const watchdog = require('./watchdog')(app, io);




const getSquadServerName = () => {
  var squadServerName;

  if (os.type() === 'Windows_NT') {
    const squadServerCfgFile = path.normalize('C:\\servers\\squad_server\\Squad\\ServerConfig\\Server.cfg');
    const squadServerCfgData = fs.readFileSync(squadServerCfgFile);
    const squadServerNameRegex = /ServerName=(.*)/i;
    const squadServerRegexResult = squadServerNameRegex.exec(squadServerCfgData);
    const squadServerName = squadServerRegexResult[1];
    console.log(`squadServerCfgData: ${squadServerCfgData}, squadServerRegexResult: ${squadServerRegexResult}, squadServerName: ${squadServerName}`);
    return squadServerName;
  }

  else {
    squadServerName = '🐧My Cool Squad Server🐧';
  }

  return squadServerName;
}


const getSquadServerIp = () => {
  var ip;
  Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
    });
  });
  return ip;
}

nunjucks.configure(templateDir, {
  express: app,
  watch: true
});
app.set('view engine', 'nunjucks');

const siteData = {
  title: 'Squad Servers Fast',
  subtitle: 'Server Management',
  squadServerName: getSquadServerName(),
  squadServerQueryPort: squadServerQueryPort,
  squadServerPort: squadServerPort,
  squadServerIp: getSquadServerIp(),
  description: 'Squad Servers Fast Control Panel',
  author: 'Chris Grimmett'
};


app.get('/', function(req, res, next) {
  res.render('management', siteData);
});

app.get('/about', function(req, res, next) {
  res.render('about', siteData);
});

app.get('/support', function(req, res, next) {
  res.render('support', siteData);
});


const port = process.env.SQUAD_SERVER_WATCHDOG_PORT || 80;
server.listen(port, function(err) {
  if (err) throw err;
  console.log(`Available on:`);

  Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4') {
        // console.log(details)
        console.log(('  ' + 'http://' + details.address + ':' + port.toString()));
      }
    });
  });
});


io.on('connection', function(socket) {
  console.log('A socket.io connection has been made.')
  socket.emit('news', { msg: 'connection established', data: 'Connection est.' });
});
