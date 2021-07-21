const { shell } = require('electron')

const hailab = document.querySelector('#hailab');
const owner = document.querySelector('#giovanni');
const pucpr = document.querySelector('#pucpr');
const github = document.querySelector('#github');

hailab.addEventListener('click', (e) => {
  //child_process.execSync('start http://example.com')
  shell.openExternal("https://github.com/HAILab-PUCPR")
});

owner.addEventListener('click', (e) => {
  shell.openExternal("https://www.linkedin.com/in/giovannipaiva/?originalSubdomain=br")
})

pucpr.addEventListener('click', (e) => {
  shell.openExternal("https://www.pucpr.br/")
});

github.addEventListener('click', (e) => {
  shell.openExternal("https://github.com/paivagio/CliNTRec")
});
