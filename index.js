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

Database.prototype.execute = function(statement) {
  if (statement.startsWith('CREATE TABLE')) {
    this.createTable(statement);

    return;
  }

  if (statement.startsWith('INSERT INTO')) {
    this.insert(statement);

    return;
  }

  throw new DatabaseError(statement, `Unknown statement: '${statement}'`);
}

const database = new Database();
const createTableStatement = 'CREATE TABLE author (id number, name string, age number, city string, state string, country string)';
const selectAuthorStatement = 'SELECT id, name FROM author';

try {
  database.execute(createTableStatement);
  database.execute('INSERT INTO author (id, name, age) VALUES (1, Douglas Crockford, 62)');
  database.execute('INSERT INTO author (id, name, age) VALUES (2, Linus Torvalds, 47)');
  database.execute('INSERT INTO author (id, name, age) VALUES (3, Martin Fowler, 54)');

  console.log(JSON.stringify(database, null, 2));

  // database.execute(selectAuthorStatement);
} catch (error) {
  console.log(error.message);
}
