const statement = 'CREATE TABLE author (id number, name string, age number, city string, state string, country string)';

const createTableRegExp = /CREATE TABLE ([a-z]+) \((.+)\)/;
const [, tableName, rawColumns] = statement.match(createTableRegExp);
const columns = rawColumns.split(',').map(column => column.trim());

const database = {
  tables: {
    [tableName]: {
      columns: {},
      data: [],
    },
  },
};

columns.forEach((item) => {
  const [name, type] = item.split(' ');

  database.tables[tableName].columns[name] = type;
})

console.log(JSON.stringify(database, null, 2));
