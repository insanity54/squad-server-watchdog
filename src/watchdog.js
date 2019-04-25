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


const getSpawn = () => {
  var squadServerPath;
  var process;

  if (os.type() === 'Windows_NT') {
    squadServerPath = 'C:\\servers\\squad_server\\SquadServer.exe';
    process = spawn(squadServerPath, squadServerArgs, spawnOpts);
  } else {
    squadServerPath = 'journalctl';
    process = spawn('journalctl', ['-x', '-f'], spawnOpts);
  }

  return process;
}

const watch = (app, io) => {


  const squad = getSpawn();

  squad.stdout.on('data', (data) => {
    io.emit('news', { msg: 'hello SquadServer.exe stdout update', data: data });
  });

  squad.stderr.on('data', (data) => {
    io.emit('news', { msg: 'hello SquadServer.exe stderr', data: data });
  });

  squad.on('close', (code) => {
    io.emit('news', { msg: 'SquadServer.exe exited', data: code });
  });

  const doggie = {
    squad: squad,
    status: '',
    log: ''
  };

  return doggie;
}


module.exports = watch;
