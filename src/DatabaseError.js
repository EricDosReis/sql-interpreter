class DatabaseError {
  constructor(statement, message) {
    this.message = message;
    this.statement = statement;
  }
}

export { DatabaseError };
