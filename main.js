import { Database } from './src/Database.js';

function main() {
  const database = new Database();

  try {
    database.execute('CREATE TABLE author (id number, name string, age number, city string, state string, country string)');
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
}

main();
