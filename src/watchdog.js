const { spawn } = require('child_process');
const path = require('path');
const squadServerPath = 'C:\\servers\\squad_server\\SquadServer.exe';
const squadServerArgs = ['Port=7787', 'QueryPort=27165', '-log'];
const spawnOpts = {
  stdio: 'pipe'
};
const squad = spawn(squadServerPath, squadServerArgs, spawnOpts);

squad.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

squad.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

squad.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
