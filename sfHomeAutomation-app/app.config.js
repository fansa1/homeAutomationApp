import dotenv from 'dotenv'
dotenv.config()

export default {
   extra: {
     key: process.env.API,
     database: process.env.DATABASE,
     project:  process.env.PROJECT,
     app: process.env.APP,
   }
  }
