const os = require('os');
const { spawn } = require('child_process');
const path = require('path');
const squadServerArgs = ['Port=7787', 'QueryPort=27165', '-log'];
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
}


module.exports = watch;
