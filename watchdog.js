const { spawn } = require('child_process');
const path = require('path');
const squadServerPath = 'C:\servers\squad\SquadServer.exe';
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
