require('dotenv').config();
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const os = require('os');
const ifaces = os.networkInterfaces();
const path = require('path');
const templateDir = path.join(__dirname, 'views');
const fs = require('fs');


const getSquadServerName = () => {
  var squadServerName;

  if (os.type() === 'Windows_NT') {
    const squadServerCfgFile = path.normalize('C:\\servers\\squad_server\\Squad\\ServerConfig\\Server.cfg');
    const squadServerCfgData = fs.readFileSync(squadServerCfgFile);
    console.log(`squadServerCfgData: ${squadServerCfgData}`);
    const squadServerNameRegex = /ServerName(.*)$/i;
    const squadServerName = squadServerNameRegex.exec(squadServerCfgData)[1];
    return squadServername;
  }

  else {
    squadServerName = '🐧My Cool Squad Server🐧';
  }

  return squadServerName;
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
  description: 'Squad Servers Fast Server Management',
  author: 'chris grimmett'
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


const port = process.env.PORT || 5555;
app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Available on:`);

  Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4') {
        console.log(('  ' + 'http://' + details.address + ':' + port.toString()));
      }
    });
  });


});
