const { spawn } = require('child_process');
const path = require('path');
const squadServerPath = 'C:\\servers\\squad_server\\SquadServer.exe';
const spawnOpts = {
  stdio: 'inherit'
};
const squad = spawn(squadServerPath);

squad.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

squad.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

squad.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
