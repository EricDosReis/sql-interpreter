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

Database.prototype.execute = function(statement) {
  if (statement.startsWith('CREATE TABLE')) {
    this.createTable(statement);
  } else {
    throw new DatabaseError(statement, `Syntax error: "${statement}"`);
  }
}

const database = new Database();
const createTableStatement = 'CREATE TABLE author (id number, name string, age number, city string, state string, country string)';
const selectAuthorStatement = 'SELECT id, name FROM author';

try {
  database.execute(createTableStatement);
  console.log(JSON.stringify(database, null, 2));

  database.execute(selectAuthorStatement);
} catch (error) {
  console.log(error.message);
}
