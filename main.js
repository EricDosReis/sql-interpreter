import { Database } from './src/Database.js';

async function main() {
  const database = new Database();

  try {
    await database.execute('CREATE TABLE author (id number, name string, age number, city string, state string, country string)');

    await Promise.all([
      database.execute('INSERT INTO author (id, name, age) VALUES (1, Douglas Crockford, 62)'),
      database.execute('INSERT INTO author (id, name, age) VALUES (2, Linus Torvalds, 47)'),
      database.execute('INSERT INTO author (id, name, age) VALUES (3, Martin Fowler, 54)')
    ]);

    console.log('-----------SELECT RESULT-----------');
    console.log(await database.execute("SELECT name, age FROM author"));
    console.log(await database.execute("SELECT name, age FROM author WHERE id = 1"));
    console.log(await database.execute("SELECT * FROM author WHERE id = 2"));
    console.log(await database.execute("SELECT name FROM author WHERE id = 1000"));

    console.log('-----------DELETE RESULT-----------');
    await database.execute("DELETE FROM author WHERE id = 2");
    console.log(await database.execute("SELECT * FROM author"));
    await database.execute("DELETE FROM author");
    console.log(await database.execute("SELECT * FROM author"));

    console.log('-----------WRONG COMMAND-----------');
    await database.execute('INSERT author (id, name, age) VALUES (4, Brendan Eich, 64)');
  } catch (error) {
    console.error(error.message);
  }
}

main();
