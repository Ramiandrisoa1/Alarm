const moment = require('moment');
const mysql = require('mysql2');

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

const alarm = [];
const getAlarm1 = async res => {
  const textSplit = res.split('\n');
  textSplit.map((text, index) => {
    if (text.includes('INT')) {
      const textTmp = text
        .split(/((?:\w+ ){1})/g)
        .map(data => {
          if (data.replace(/\s/g, '')) {
            return data.replace(/\s/g, '');
          }
        })
        .filter(data => data !== undefined);
      for (let idx = 1; idx <= 12; idx++) {
        const obj = {};
        const value = textSplit[index + idx]
          .split(/((?:\w+ ){1})/g)
          .map(data => {
            if (data.replace(/\s/g, '')) {
              return data.replace(/\s/g, '');
            }
          })
          .filter(data => data !== undefined);
        for (let i = 0, l = value.length; i < l; i++) {
          obj[textTmp[i]] = isNaN(Number(value[i])) ? value[i] : +value[i];
        }
        alarm.push(obj);
      }
    }
  });
  // saveData1(alarm);
};

const saveData1 = data => {
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

const getList1 = (request, response) => {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm1', {
      res: res,
    });
  });
};

const getGraphe1 = (request, response) => {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe1', {
      graphe: res,
    });
  });
};

const alarmList1 = (request, response) => {
  db.query('SELECT * FROM `alarm1`', (error, res) => {
    return response.status(201).json(res);
  });
};

const getList2 = (request, response) => {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    if (error) throw error;
    response.render('pages/alarm2', {
      res: res,
    });
  });
};

const getGraphe2 = (request, response) => {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    if (error) throw error;
    response.render('pages/graphe2', {
      res: res,
    });
  });
};

const alarmList2 = (request, response) => {
  db.query('SELECT * FROM `alarm2`', (error, res) => {
    return response.status(201).json(res);
  });
};

module.exports = {
  getAlarm1,
  getList1,
  getGraphe1,
  alarmList1,
  getList2,
  getGraphe2,
  alarmList2,
};
