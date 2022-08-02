const moment = require('moment');
const mysql = require('mysql2');

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

const alarm = [];

const getAlarm3 = res => {
  const textSplit = res.split('\n');
  textSplit.map((text, index) => {
    const obj = {};
    if (text.includes('SAE') && !text.includes('>')) {
      const textTmp = text
        .split(/((?:\w+ ){1})/g)
        .map(data => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter(data => data !== undefined);
      const value = textSplit[index + 1]
        .split(/((?:\w+ ){1})/g)
        .map(data => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter(data => data !== undefined);
      for (let i = 0; i < 7; i++) {
        obj[textTmp[i]] = value[i];
      }
      alarm.push(obj);
    }
  });
  //   saveData3(alarm);
};

const saveData3 = data => {
  let date = moment().format('YYYY-MM-D  HH:mm:ss');
  for (let i = 0; i < data.length; i++) {
    const al = data[i];
    db.query(
      "INSERT INTO `alarm3` (`SAE`, `BLOCK`, `CNTRTYP`, `NI`, `NIU`, `NIE`, `NIR`, `dateCreate`) VALUES ('" +
        al.SAE +
        "', '" +
        al.BLOCK +
        "', '" +
        al.CNTRTYP +
        "', '" +
        al.NI +
        "', '" +
        al.NIU +
        "', '" +
        al.NIE +
        "', '" +
        al.NIR +
        "', '" +
        date +
        "');",
      al,
      function (err, result) {
        if (err) throw err;
        console.log('data 1 inserted');
      }
    );
  }
};

const getList3 = (request, response) => {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm3', {
      res: res,
    });
  });
};

const getGraphe3 = (request, response) => {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe3', {
      res: res,
    });
  });
};

const alarmList3 = (request, response) => {
  db.query('SELECT * FROM `alarm3`', (error, res) => {
    return response.status(201).json(res);
  });
};

module.exports = {
  getAlarm3,
  getList3,
  getGraphe3,
  alarmList3,
};
