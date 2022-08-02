const express = require('express');
const {
  getList1,
  getGraphe1,
  alarmList1,
  getList2,
  getGraphe2,
  alarmList2,
} = require('../controllers/alarmCp.controller');

const {
  getList3,
  getGraphe3,
  alarmList3,
} = require('../controllers/alarmSae.controller');

const router = express.Router();

router.get('/', function (request, response) {
  response.send('alarm');
});

router.get('/list-alarm1', getList1);

router.get('/list-alarm1/graphe1', getGraphe1);

router.get('/alarms1', alarmList1);

router.get('/list-alarm2', getList2);

router.get('/list-alarm2/graphe2', getGraphe2);

router.get('/alarms2', alarmList2);

router.get('/list-alarm3', getList3);

router.get('/list-alarm3/graphe3', getGraphe3);

router.get('/alarms3', alarmList3);

module.exports = { routes: router };
