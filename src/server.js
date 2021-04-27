const knex = require('knex')
const app = require('./app')
const { PORT } = require('./config')

const db = knex({
  client: 'pg',
  connection: {
      host : 'ec2-34-192-173-173.compute-1.amazonaws.com',
      user: 'jzwvtqvssnlczw',
      database : 'd70asjqg3c6hka',
      password : '41cfbf98bb1916b867189c19b45f37e2545ef6e33446b6bc3daaa74e583db5b6',
      ssl: { 
        rejectUnauthorized: false 
      }
    }
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})