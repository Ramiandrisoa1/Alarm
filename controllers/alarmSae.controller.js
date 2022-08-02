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

const getAlarm2 = res => {
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
//   saveData2(alarm);
};


const saveData2 = data => {
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

module.exports = {
  getAlarm2,
};
