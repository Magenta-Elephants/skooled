module.exports = {
  client: 'pg',
  debug: false,
  // process.env.DATABASE_URL only exist on Heroku. That's why we need a or statement
  // to be able to run the database on or local machines as well.
  connection: process.env.DATABASE_URL || {
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'test3',
	  charset: 'utf8'
  },
  ssl: true
};