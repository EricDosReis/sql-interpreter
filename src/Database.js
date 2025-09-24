import { DatabaseError } from './DatabaseError.js';
import { Parser } from './Parser.js';

class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

  createTable(parsedStatement) {
    const [, tableName, rawColumns] = parsedStatement;

    const columns = rawColumns.split(',').map(column => column.trim());

    this.tables[tableName] = {
      columns: {},
      data: [],
    };

    columns.forEach((item) => {
      const [name, type] = item.split(' ');

      this.tables[tableName].columns[name] = type;
    });
  }

  insert(parsedStatement) {
    const [, tableName, rawColumns, rawValues] = parsedStatement;

    const columns = rawColumns.split(',').map(column => column.trim());
    const values = rawValues.split(',').map(value => value.trim());

    const row = columns.reduce((acc, column, index) => {
      acc[column] = values[index];

      return acc;
    }, {});

    this.tables[tableName].data.push(row);
  }

  delete(parsedStatement) {
    const [, tableName, whereClause] = parsedStatement;

    if (whereClause) {
      const [whereColumn, whereValue] = whereClause.split('=').map(value => value.trim());

      this.tables[tableName].data = this.tables[tableName].data.filter(row => row[whereColumn] !== whereValue);
    } else {
      this.tables[tableName].data = [];
    }
  }

  select(parsedStatement) {
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

  execute(statement) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = this.parser.parse(statement);

        if (result) {
          resolve(this[result.command](result.parsedStatement));
        }

        reject(new DatabaseError(statement, `Unknown statement: '${statement}'`));
      }, 200);
    })
  }
}

export { Database };
