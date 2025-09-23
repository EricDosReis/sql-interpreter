function Parser() {
  const commands = new Map([
    ['createTable', /CREATE TABLE ([a-z]+) \((.+)\)/],
    ['insert', /INSERT INTO ([a-z]+) \((.+)\) VALUES \((.+)\)/],
    ['delete', /DELETE FROM ([a-z]+)(?: WHERE (.+))?/],
    ['select', /SELECT (.+) FROM ([a-z]+)(?: WHERE (.+))?/]
  ]);

  this.parse = function(statement) {
    for (let [command, regExp] of commands) {
      const parsedStatement = statement.match(regExp);

      if (parsedStatement) {
        return {
          command,
          parsedStatement,
        }
      }
    }
  }
}

function DatabaseError(statement, message) {
  this.message = message;
  this.statement = statement;
}

function Database() {
  this.tables = {};
  this.parser = new Parser();
}

Database.prototype.createTable = function(parsedStatement) {
  const [, tableName, rawColumns] = parsedStatement;
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

Database.prototype.insert = function(parsedStatement) {
  const [, tableName, rawColumns, rawValues] = parsedStatement;

  const columns = rawColumns.split(',').map(column => column.trim());
  const values = rawValues.split(',').map(value => value.trim());

  const row = columns.reduce((acc, column, index) => {
    acc[column] = values[index];

    return acc;
  }, {});

  this.tables[tableName].data.push(row);
}

Database.prototype.delete = function(parsedStatement) {
  const [, tableName, whereClause] = parsedStatement;

  if (whereClause) {
    const [whereColumn, whereValue] = whereClause.split('=').map(value => value.trim());

    this.tables[tableName].data = this.tables[tableName].data.filter(row => row[whereColumn] !== whereValue);
  } else {
    this.tables[tableName].data = [];
  }
}

Database.prototype.select = function(parsedStatement) {
  const [, rawSelectColumns, tableName, whereClause] = parsedStatement;
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
  const result = this.parser.parse(statement);

  if (result) {
    return this[result.command](result.parsedStatement);
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

  console.log('-----------SELECT RESULT-----------');
  console.log(database.execute("SELECT name, age FROM author"));
  console.log(database.execute("SELECT name, age FROM author WHERE id = 1"));
  console.log(database.execute("SELECT * FROM author WHERE id = 2"));
  console.log(database.execute("SELECT * FROM author WHERE id = 1000"));
  console.log(database.execute("SELECT name FROM author WHERE id = 1000"));

  console.log('-----------DELETE RESULT-----------');
  database.execute("DELETE FROM author WHERE id = 2");
  console.log(database.execute("SELECT * FROM author"));
  database.execute("DELETE FROM author");
  console.log(database.execute("SELECT * FROM author"));

  console.log('-----------WRONG COMMAND-----------');
  database.execute('INSERT author (id, name, age) VALUES (4, Brendan Eich, 64)');
} catch (error) {
  console.log(error.message);
}
