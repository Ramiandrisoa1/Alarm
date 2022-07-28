'use strict';
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const mysql = require('mysql2');
const moment = require('moment');
let connectionData = {
  host: 'localhost',
  port: 3306,
  database: 'alarm',
  user: 'root',
  password: 'root',
  multipleStatements: true,
  connectionLimit: 10,
};
const db = mysql.createConnection(connectionData);
db.connect((err) => {
  if (err) {
    console.error(err);
    console.log('connect erreur');
  } else {
    console.log('connect successfully');
  }
});

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

const getDataAlarm = (data) => {
  return axios
    .post('http://10.200.200.20:3018/run_axeCmd', {
      nodeIP: data.nodeIP,
      cmd: data.cmd,
    })
    .then((res) => {
      let alam = res.data.alarm;
      if (data.cmd === '-cp cp1 plldp') {
        getAlarm1(alam);
      }
      if (data.cmd === 'SAAEP:SAE=604,BLOCK=SCCLM') {
        getAlarm2(alam);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const alarm = [];

const getAlarm1 = (res) => {
  const textSplit = res.split('\n');
  textSplit.map((text, index) => {
    if (text.includes('INT')) {
      const textTmp = text
        .split(/((?:\w+ ){1})/g)
        .map((data) => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter((data) => data !== undefined);
      for (let idx = 1; idx <= 12; idx++) {
        const obj = {};
        const value = textSplit[index + idx]
          .split(/((?:\w+ ){1})/g)
          .map((data) => {
            if (data.replace(/\s/g, '')) {
              return data.replace(/\s/g, '');
            }
          })
          .filter((data) => data !== undefined);
        for (let i = 0, l = value.length; i < l; i++) {
          obj[textTmp[i]] = isNaN(Number(value[i])) ? value[i] : +value[i];
        }
        alarm.push(obj);
      }
    }
  });
  // saveData(alarm);
};

const getAlarm2 = (res) => {
  const textSplit = res.split('\n');
  textSplit.map((text, index) => {
    const obj = {};
    if (text.includes('SAE') && !text.includes('>')) {
      const textTmp = text
        .split(/((?:\w+ ){1})/g)
        .map((data) => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter((data) => data !== undefined);
      const value = textSplit[index + 1]
        .split(/((?:\w+ ){1})/g)
        .map((data) => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter((data) => data !== undefined);
      for (let i = 0; i < 7; i++) {
        obj[textTmp[i]] = value[i];
      }
      alarm.push(obj);
    }
  });
};

const saveData = (data) => {
  let date = moment().format('YYYY-MM-D  HH:mm:ss');
  for (let i = 0; i < data.length; i++) {
    const al = data[i];
    if (al.PLOAD) {
      db.query(
        "INSERT INTO `alarm1` (`INT`, `PLOAD`, `CALIM`, `OFFDO`, `OFFDI`, `FTCHDO`, `FTCHDI`, `OFFMPH`, `OFFMPL`, `FTCHMPH`, `FTCHMPL`, `dateCreate`) VALUES ('" +
          al.INT +
          "', '" +
          al.PLOAD +
          "', '" +
          al.CALIM +
          "', '" +
          al.OFFDO +
          "', '" +
          al.OFFDI +
          "', '" +
          al.FTCHDO +
          "', '" +
          al.FTCHDI +
          "', '" +
          al.OFFMPH +
          "', '" +
          al.OFFMPL +
          "', '" +
          al.FTCHMPH +
          "', '" +
          al.FTCHMPL +
          "', '" +
          date +
          "');",
        al,
        function (err, result) {
          if (err) throw err;
          console.log('data 1 inserted');
        }
      );
    } else {
      db.query(
        "INSERT INTO `alarm2` (`INT`, `OFFTCAP`, `FTDTCAP`, `dateCreate`) VALUES ('" +
          al.INT +
          "', '" +
          al.OFFTCAP +
          "', '" +
          al.FTDTCAP +
          "', '" +
          date +
          "');",
        al,
        function (err, result) {
          if (err) throw err;
          console.log('data 2 inserted');
        }
      );
    }
  }
};

const test = {
  nodeIP: '10.32.2.6',
  cmd: '-cp cp1 plldp',
};

getDataAlarm(test);

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  response.send(alarm);
});

app.get('/list-alarm1', function (request, response) {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm1', {
      res: res,
    });
  });
});

app.get('/list-alarm2', function (request, response) {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm2', {
      res: res,
    });
  });
});

app.listen(process.env.PORT, () =>
  console.log('app is listening on url http://localhost:' + process.env.PORT)
);
