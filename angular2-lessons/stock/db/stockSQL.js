var stockSQL = {
    insert: 'INSERT INTO years(stockId,date,high,low,open,close,volume) VALUES(?,?,?,?,?,?,?)',
    queryAll: 'SELECT * FROM years',
    getUserById: 'SELECT * FROM User WHERE uid = ? ',
};
module.exports = stockSQL;