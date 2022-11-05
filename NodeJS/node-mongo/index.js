require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dboper = require("./operations");

const uri = process.env.MONGO_URI;
const dbName = "conFusion";

MongoClient.connect(uri, (err, client) => {
  assert.equal(err, null);

  console.log("Connected to server");

  const db = client.db(dbName);
  dboper.insertDocument(
    db,
    { name: "Vadonut", description: "Test" },
    "dishes",
    (result) => {
      console.log(`Insert document\n${result.ops}`);
      dboper.findDocuments(db, "dishes", (docs) => {
        console.log(`Found documents\n${docs}`);

        dboper.updateDocument(
          db,
          { name: "Vadonut" },
          { description: "Update Test" },
          "dishes",
          (docs) => {
            console.log(`Updated Document\n${result.result}`);
            dboper.findDocuments(db, "dishes", (docs) => {
              console.log(`Found documents\n${docs}`);
              db.dropCollection("dishes", (result) => {
                console.log(`Drop collection ${result}`);
                client.close();
              });
            });
          }
        );
      });
    }
  );
});
