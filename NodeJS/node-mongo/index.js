require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const uri = process.env.MONGO_URI;
const dbName = "conFusion";

MongoClient.connect(uri, (err, client) => {
  assert.equal(err, null);

  console.log("Connected to server");

  const db = client.db(dbName);
  const collection = db.collection("dishes");

  collection.insertOne(
    { name: "Uthappizza2", description: "test2" },
    (err, res) => {
      assert.equal(err, null);
      console.log("After insert:\n");
      console.log(res.ops);

      collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log("Found:\n");
        console.log(docs);

        db.dropCollection("dishes", (err, res) => {
          assert.equal(err, null);

          client.close();
        });
      });
    }
  );
});
