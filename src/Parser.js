class Parser {
  constructor() {
    this.commands = new Map([
      ['createTable', /CREATE TABLE ([a-z]+) \((.+)\)/],
      ['insert', /INSERT INTO ([a-z]+) \((.+)\) VALUES \((.+)\)/],
      ['delete', /DELETE FROM ([a-z]+)(?: WHERE (.+))?/],
      ['select', /SELECT (.+) FROM ([a-z]+)(?: WHERE (.+))?/]
    ]);
  }

  parse(statement) {
    for (let [command, regExp] of this.commands) {
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

export { Parser };
