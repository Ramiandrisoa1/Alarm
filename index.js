'use strict';
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const mysql = require('mysql2');
const alarmes = require('./routes/alarm.route');
const { getAlarm1 } = require('./controllers/alarmCp.controller');
const { getAlarm3 } = require('./controllers/alarmSae.controller');

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

db.connect(err => {
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

const test = {
  nodeIP: '10.32.2.6',
  cmd: 'SAAEP:SAE=604,BLOCK=SCCLM',
};

const getDataAlarm = data => {
  return axios
    .post('http://10.200.200.20:3018/run_axeCmd', {
      nodeIP: data.nodeIP,
      cmd: data.cmd,
    })
    .then(res => {
      let alam = res.data.alarm;
      if (data.cmd === '-cp cp1 plldp') {
        getAlarm1(alam);
      }
      if (data.cmd === 'SAAEP:SAE=604,BLOCK=SCCLM') {
        getAlarm3(alam);
      }
    })
    .catch(error => {
      console.error(error);
    });
};

getDataAlarm(test);

app.use(express.static(__dirname + '/public'));

app.use('/api', alarmes.routes);

app.listen(process.env.PORT, () =>
  console.log('app is listening on url http://localhost:' + process.env.PORT)
);
