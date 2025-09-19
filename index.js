function DatabaseError(statement, message) {
  this.message = message;
  this.statement = statement;
}

function Database() {
  this.tables = {};
}

Database.prototype.createTable = function(statement) {
  const createTableRegExp = /CREATE TABLE ([a-z]+) \((.+)\)/;
  const [, tableName, rawColumns] = statement.match(createTableRegExp);
  const columns = rawColumns.split(',').map(column => column.trim());

  this.tables[tableName] = {
    columns: {},
    data: [],
  };

  columns.forEach((item) => {
    const [name, type] = item.split(' ');

    this.tables[tableName].columns[name] = type;
  })
}

Database.prototype.insert = function(statement) {
  const insertRegExp = /INSERT INTO ([a-z]+) \((.+)\) VALUES \((.+)\)/;
  const [, tableName, rawColumns, rawValues] = statement.match(insertRegExp);

  const columns = rawColumns.split(',').map(column => column.trim());
  const values = rawValues.split(',').map(value => value.trim());

  const row = columns.reduce((acc, column, index) => {
    acc[column] = values[index];

    return acc;
  }, {});

  this.tables[tableName].data.push(row);
}

Database.prototype.select = function(statement) {
  const selectRegExp = /SELECT (.+) FROM ([a-z]+)(?: WHERE (.+))?/;
  const [, rawSelectColumns, tableName, whereClause] = statement.match(selectRegExp);
  const selectColumns = rawSelectColumns.split(',').map(column => column.trim());
  let rows = [];

  if (whereClause) {
    const [whereColumn, whereValue] = whereClause.split('=').map(value => value.trim());

    rows = this.tables[tableName].data.filter(row => row[whereColumn] === whereValue);
  } else {
    rows = this.tables[tableName].data;
  }

  if (selectColumns.includes('*') === false && rows.length > 0) {
    rows = rows
      .map((row) => {
        return selectColumns.reduce((acc, column) => {
          acc[column] = row[column];

          return acc;
        }, {});
      });
  }

  return rows;
}

Database.prototype.execute = function(statement) {
  if (statement.startsWith('CREATE TABLE')) {
    this.createTable(statement);

    return;
  }

  if (statement.startsWith('INSERT INTO')) {
    this.insert(statement);

    return;
  }

  if (statement.startsWith('SELECT')) {
    return this.select(statement);
  }

  throw new DatabaseError(statement, `Unknown statement: '${statement}'`);
}

const database = new Database();
const createTableStatement = 'CREATE TABLE author (id number, name string, age number, city string, state string, country string)';

try {
  database.execute(createTableStatement);
  database.execute('INSERT INTO author (id, name, age) VALUES (1, Douglas Crockford, 62)');
  database.execute('INSERT INTO author (id, name, age) VALUES (2, Linus Torvalds, 47)');
  database.execute('INSERT INTO author (id, name, age) VALUES (3, Martin Fowler, 54)');

  console.log(JSON.stringify(database, null, 2));

  console.log(database.execute("SELECT name, age FROM author"));
  console.log(database.execute("SELECT name, age FROM author WHERE id = 1"));
  console.log(database.execute("SELECT * FROM author WHERE id = 2"));
  console.log(database.execute("SELECT * FROM author WHERE id = 1000"));
  console.log(database.execute("SELECT name FROM author WHERE id = 1000"));
} catch (error) {
  console.log(error.message);
}
