# SQL Interpreter written in JavaScript

The interpreter supports simple commands like `CREATE TABLE`, `INSERT`, `DELETE`,
`SELECT`. Maybe I'll add some more in the future, but for now you can see them
working by running `start` script.

```bash
npm start
```

The method `execute` from `Database` object instance is responsible for
executing the commands.

```javascript
await database.execute('INSERT INTO author (id, name, age) VALUES (1, Douglas Crockford, 62)');
```

This method is async because I wanted to simulate the interaction time with a
real database.

Feel free to modify the code, I hope you enjoy it!
