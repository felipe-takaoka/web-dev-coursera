require("dotenv").config();
const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected correctly to the server");

    var newDish = Dishes({
      name: "Uthappizza",
      description: "test",
    });

    newDish
      .save()
      .then((dish) => {
        console.log(dish);

        return Dishes.find({}).exec();
      })
      .then((dishes) => {
        console.log(dishes);

        return Dishes.remove({});
      })
      .then(() => mongoose.connection.close())
      .catch((err) => console.log(err));
  });
