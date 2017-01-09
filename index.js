const { MongoClient } = require('mongodb')
const assert = require('assert')
const graphqlHTTP = require('express-graphql')
const express = require('express')
const{ graphql} = require('graphql')

const fs = require('fs')
const path = require('path')

const { introspectionQuery } = require('graphql/utilities')

console.log(introspectionQuery)

const app = express()
app.use(express.static('./public'))

const mySchema = require('./schema/main')
const MONGO_URL = 'mongodb://localhost:27017/test'

MongoClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err)
  console.log('Connected to MongoDB server')

  app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    context: { db },
    graphiql: true
  }))

  graphql(mySchema, introspectionQuery)
  .then(result => {
    fs.writeFileSync(
      path.join(__dirname, 'cache/schema.json'),
      JSON.stringify(result, null, 2))

    console.log('schema.json created')
  })
  .catch(console.error)

  app.listen(3000, () => {
    console.log('Running Express on 3000')
  }) 
})