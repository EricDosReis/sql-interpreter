const statement = 'CREATE TABLE author (id number, name string, age number, city string, state string, country string)';

const createTableRegExp = /CREATE TABLE ([a-z]+) \((.+)\)/;
const [, tableName, rawColumns] = statement.match(createTableRegExp);
const columns = rawColumns.split(',').map(column => column.trim());

console.log(tableName);
console.log(columns);
