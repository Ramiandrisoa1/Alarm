'use strict';
const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

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

const test = {
  nodeIP: '10.32.2.6',
  cmd: 'SAAEP:SAE=604,BLOCK=SCCLM',
};

getDataAlarm(test);

app.get('/', function (request, response) {
  response.send(alarm);
});

app.listen(process.env.PORT, () =>
  console.log('app is listening on url http://localhost:' + process.env.PORT)
);
