const os = require('os');
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const squadServerPort = process.env.SQUAD_SERVER_PORT || 7787;
const squadServerQueryPort = process.env.SQUAD_SERVER_QUERY_PORT || 27165;
const squadServerArgs = [`Port=${ squadServerPort }`, `QueryPort=${ squadServerQueryPort }`, '-log'];

const spawnOpts = {
  stdio: 'pipe'
};


const doSpawn = () => {
  var squadServerPath;
  var process;

  if (os.type() === 'Windows_NT') {
    squadServerPath = 'C:\\servers\\squad_server\\SquadServer.exe';
    process = spawn(squadServerPath, squadServerArgs, spawnOpts);
  } else {
    squadServerPath = 'journalctl';
    process = spawn('tail', ['-f', '/var/log/syslog'], spawnOpts);
  }

  return process;
}

const watch = (app, io) => {


  const squad = doSpawn();

  // console.log(squad);
  var stat = 'Offline';

  squad.stdout.on('data', (data) => {
    console.log(`data on stdout: ${data}`);
    stat = 'Online';
    io.emit('news', { msg: 'hello SquadServer.exe stdout update', data: data.toString() });
  });

  squad.stderr.on('data', (data) => {
    console.log(`data on stderr: ${data}`);
    io.emit('news', { msg: 'hello SquadServer.exe stderr', data: data });
  });

  squad.on('close', (code) => {
    console.log(`squad has closed!: ${data}`);
    stat = 'Offline';
    io.emit('lifecycle', { msg: 'SquadServer.exe closed', status: stat });
  });

  squad.on('exit', (code) => {
    console.log(`squad has exited!: ${data}`);
    stat = 'Offline';
    io.emit('lifecycle', { msg: 'SquadServer.exe exited', status: stat });
  });


  // Return this object so index.js can know what watchdog.js is doing.
  const doggie = {
    squad: squad,
    status: stat,
    log: ''
  };

  return doggie;
}


module.exports = watch;
