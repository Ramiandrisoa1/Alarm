'use strict';
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const mysql = require('mysql2');
const { getAlarm1 } = require('./controllers/alarmCp.controller');
const { getAlarm2 } = require('./controllers/alarmSae.controller');

let connectionData = {
  host: 'localhost',
  port: 3306,
  database: 'alarm',
  user: 'fabio',
  password: 'fabio',
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

const test = {
  nodeIP: '10.32.2.6',
  cmd: 'SAAEP:SAE=604,BLOCK=SCCLM',
};

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

getDataAlarm(test);

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  response.send('alarm');
});

app.get('/list-alarm1', function (request, response) {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm1', {
      res: res,
    });
  });
});

app.get('/alarms1', function (request, response) {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    return response.status(201).json(res);
  });
});

app.get('/list-alarm1/graphe1', function (request, response) {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe1', {
      graphe: res,
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

app.get('/list-alarm3', function (request, response) {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm3', {
      res: res,
    });
  });
});

app.get('/alarms3', function (request, response) {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    return response.status(201).json(res);
  });
});

app.get('/list-alarm3/graphe3', function (request, response) {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe3', {
      res: res,
    });
  });
});

app.get('/alarms2', function (request, response) {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    return response.status(201).json(res);
  });
});

app.get('/list-alarm2/graphe2', function (request, response) {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe2', {
      res: res,
    });
  });
});

app.listen(process.env.PORT, () =>
  console.log('app is listening on url http://localhost:' + process.env.PORT)
);