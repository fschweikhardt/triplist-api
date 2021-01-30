require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 8000,
    //NODE_ENV: process.env.NODE_ENV || production,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/triplist',
    API_TOKEN: process.env.API_TOKEN || 123456789,
    JWT_SECRET: process.env.JWT_SECRET
  }