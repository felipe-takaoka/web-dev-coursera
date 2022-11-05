require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations");

const uri = process.env.MONGO_URI;
const dbName = "conFusion";

MongoClient.connect(uri)
  .then((client) => {
    console.log("Connected to server");

    const db = client.db(dbName);
    dboper
      .insertDocument(db, { name: "Vadonut", description: "Test" }, "dishes")
      .then((result) => {
        console.log(`Insert document\n${result.ops}`);
        return dboper.findDocuments(db, "dishes");
      })
      .then((docs) => {
        console.log(`Found documents\n${docs}`);
        return dboper.updateDocument(
          db,
          { name: "Vadonut" },
          { description: "Update Test" },
          "dishes"
        );
      })
      .then((result) => {
        console.log(`Updated Document\n${result.result}`);
        return dboper.findDocuments(db, "dishes");
      })
      .then((docs) => {
        console.log(`Found documents\n${docs}`);
        return db.dropCollection("dishes");
      })
      .then((result) => {
        console.log(`Drop collection ${result}`);
        client.close();
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
