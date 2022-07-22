'use strict';
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

const getDataAlarm = (nodeIP, cmd) => {
  return axios
    .post('http://10.200.200.20:3018/run_axeCmd', {
      nodeIP: '10.32.2.6',
      cmd: '-cp cp1 plldp',
    })
    .then((res) => {
      return res.data.alarm;
    })
    .catch((error) => {
      console.error(error);
    });
};

const alarm = [];
getDataAlarm().then((res) => {
  console.log(res);
  const textSplit = res.split('\n');
  textSplit.map((text, index) => {
    const obj = {};
    if (text.includes('INT')) {
      const textTmp = text
        .split(/((?:\w+ ){1})/g)
        .map((data) => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter((data) => data !== undefined);

      for (let i = 1; i < 12; i++) {
        console.log(i);
      }
      const value = textSplit[1]
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
});

app.get('/', function (request, response) {
  response.send(alarm);
});

app.listen(process.env.PORT, () =>
  console.log('app is listening on url http://localhost:' + process.env.PORT)
);
