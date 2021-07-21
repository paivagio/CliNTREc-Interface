const { PythonShell } = require('python-shell');
const { shell } = require('electron');
const fs = require("fs");

const newText = document.getElementById("textBox");
const form = document.getElementById("forms");
const file = document.querySelector('#fileInput');
const id = document.querySelector('#id');
const url = document.querySelector('#url');
const hailab = document.querySelector('#hailab');
const owner = document.querySelector('#giovanni');
const pucpr = document.querySelector('#pucpr');
const run = document.querySelector('#run');
const butSet = document.querySelector('#settingsBut');
const closeSet = document.querySelector('#closeSettings');
const trash = document.querySelector('#trash');

var file_name = '';

function runPython() {
  let pyshell = new PythonShell('script.py');

  pyshell.send(JSON.stringify(form.textContent))

  pyshell.on('message', function (message) {
    console.log(message);
    newText.textContent = message;
  })

  pyshell.end(function (err) {
    if (err) {
      throw err;
    };
    console.log('finished');
  });
}

function cleanOthers(id) {
  if (id == 'idCheck') {
    document.getElementById('urlCheck').style.opacity = 0;
    document.querySelector('#url input').value = '';
    document.querySelector('#filename').textContent = '';
  }
  else if (id == 'urlCheck') {
    document.getElementById('idCheck').style.opacity = 0;
    document.querySelector('#id input').value = '';
    document.querySelector('#filename').textContent = '';
  }
  else {
    document.getElementById('urlCheck').style.opacity = 0;
    document.querySelector('#url input').value = '';
    document.getElementById('idCheck').style.opacity = 0;
    document.querySelector('#id input').value = '';
  }
}

function lookForTrial(target, imgId) {
  const input = document.querySelector(target);
  text = input.value;

  if (text === '') {
    document.getElementById(imgId).style.opacity = 0;
    document.getElementById("inclusion").textContent = '';
    document.getElementById("exclusion").textContent = '';
  }
  else {

    var inc = '', exc = '', name = '';
    var erro = false;

    var spawn = require("child_process").spawn;
    var process = spawn('python', ["lookForTrial.py", text, target]);

    process.stdout.on('data', function (data) {
      var message = data.toString("latin1");

      var c = message.split('%%%%');

      if (c[0] == 'Error') {
        erro = true;
      }
      else {
        inc = c[0];
        exc = c[1];
        name = c[2];
      }
    });

    process.on('exit', function (err) {
      if (err) {
        throw err;
      };

      var crit = [inc, exc]
      cleanOthers(imgId);

      if (crit !== null && !erro) {
        document.getElementById(imgId).style.opacity = 1;
        document.getElementById(imgId).src = '../images/check_bold.svg'
        document.getElementById("inclusion").textContent = crit[0];
        document.getElementById("exclusion").textContent = crit[1];
        file_name = name;
      }
      else {
        document.getElementById(imgId).style.opacity = 1;
        document.getElementById(imgId).src = '../images/warning.svg'
        document.getElementById("inclusion").textContent = '';
        document.getElementById("exclusion").textContent = '';
      }
    });
  }
}

file.addEventListener('change', (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName}`;

  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    let pyshell = new PythonShell('openFile.py');
    var cont = 0;
    var inc = '', exc = '';
    var erro = false;

    pyshell.send(JSON.stringify(evt.target.result))

    pyshell.on('message', function (message) {
      if (message == 'Error') {
        erro = true;
      }

      if (cont == 0) {
        inc = message;
        cont++;
      }
      else {
        exc = message;
      }
    })

    pyshell.end(function (err) {
      if (err) {
        throw err;
      };
      cleanOthers(' ');

      var crit = [inc, exc]
      if (crit !== null && !erro) {
        document.querySelector('#filename').textContent = fileNameAndSize;
        document.querySelector('#filename').style.color = '#1400FC';
        document.getElementById("inclusion").textContent = crit[0];
        document.getElementById("exclusion").textContent = crit[1];
        file_name = document.querySelector('#filename').textContent;
      }
      else {
        document.querySelector('#filename').textContent = 'Erro ao carregar arquivo';
        document.querySelector('#filename').style.color = '#FF0000';
        document.getElementById("inclusion").textContent = '';
        document.getElementById("exclusion").textContent = '';
      }
    });
  }
  reader.onerror = function (evt) {
    document.querySelector('#filename').textContent = 'Erro ao carregar arquivo';
  }
});

id.addEventListener('change', (e) => {
  lookForTrial('#id input', 'idCheck');
});

url.addEventListener('change', (e) => {
  lookForTrial('#url input', 'urlCheck');
});

id.addEventListener('submit', function (e) {
  e.preventDefault();
});

url.addEventListener('submit', function (e) {
  e.preventDefault();
});

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

run.addEventListener('click', (e) => {
  var inc = document.querySelector('#inclusion').textContent;
  var exc = document.querySelector('#exclusion').textContent;
  var filename = file_name;
  var dir = document.querySelector('#clintrec_dir').textContent;

  if (dir == '' || !fs.existsSync(dir)) {
    document.querySelector('.settings').style.backgroundColor = 'rgb(209, 74, 74)';
    document.querySelector('.settings').style.opacity = 1;
    document.querySelector('.settings').style.zIndex = 2;
  }
  else if (inc == '' && exc == '') {
    document.querySelector('.results p').style.color = '#F00';
  }
  else {
    document.querySelector('#loading').style.opacity = 1;
    document.querySelector('#loading').style.zIndex = 3;

    var num = 0, ec = '', pacients = '';
    var erro = false;

    var spawn = require("child_process").spawn;
    //where clintrec, filename, inc_text, exc_text
    var process = spawn('python', ["main.py", dir, filename, inc, exc]);

    process.stdout.on('data', function (data) {
      var message = data.toString("latin1");

      var c = message.split('%%%%');

      if (c[0] != '' && c.length > 1) {
        erro = true;
      }
      else {
        num = c[1];
        ec = c[2];
        pacients = c[3];
      }

      console.log(message.split('%%%%'));
    });

    process.on('exit', function (err, signal) {
      if (err || erro) {
        document.querySelector('#numSelected').textContent = 'Erro';
        document.querySelector('#runImage').style.top = '-2.8rem';
        document.querySelector('#runImage').src = '../images/warning.svg'
        document.querySelector('.results p').style.opacity = 0;
        document.querySelector('.posRun').style.opacity = 1;
        document.querySelector('.posRun').style.zIndex = 1;
        console.log(erro);
        console.log(signal);
        throw err;
      };

      if (num === "0") {
        document.querySelector('#runImage').src = '../images/no_cohort.svg'
      }
      else {
        document.querySelector('#runImage').src = '../images/cohort.svg'
      }
      document.querySelector('#buttonDownloadEc a').setAttribute('href', String(ec))
      document.querySelector('#buttonDownloadP a').setAttribute('href', String(pacients))
      document.querySelector('#numSelected').textContent = num;
      document.querySelector('.results p').style.opacity = 0;
      document.querySelector('.posRun').style.opacity = 1;
      document.querySelector('.posRun').style.zIndex = 1;

      document.querySelector('#loading').style.opacity = 0;
      document.querySelector('#loading').style.zIndex = -2;
    });
  }
});

trash.addEventListener('click', (e) => {
  document.querySelector('#runImage').src = '../images/run_idle.svg';
  document.querySelector('#runImage').style.top = '-.8rem';
  document.querySelector('.posRun').style.opacity = 0;
  document.querySelector('.posRun').style.zIndex = -1;
  document.querySelector('.results p').style.opacity = 1;

  document.getElementById("inclusion").textContent = '';
  document.getElementById("exclusion").textContent = '';
  document.getElementById('urlCheck').style.opacity = 0;
  document.querySelector('#url input').value = '';
  document.getElementById('idCheck').style.opacity = 0;
  document.querySelector('#id input').value = '';
  document.querySelector('#fileInput').value = '';
  document.querySelector('#filename').textContent = 'Nenhum arquivo selecionado';
  document.querySelector('#filename').style.color = '#8F9BB3';
});

butSet.addEventListener('click', (e) => {
  document.querySelector('.settings').style.opacity = 1;
  document.querySelector('.settings').style.zIndex = 2;
});

closeSet.addEventListener('click', (e) => {
  document.querySelector('.settings').style.opacity = 0;
  document.querySelector('.settings').style.zIndex = -2;
  document.querySelector('.settings').style.backgroundColor = '#FFFF';
});