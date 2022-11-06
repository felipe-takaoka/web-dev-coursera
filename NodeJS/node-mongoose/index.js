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

    Dishes.create({
      name: "Uthappizza",
      description: "test",
    })
      .then((dish) => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(
          dish._id,
          { $set: { description: "Updated test" } },
          { new: true }
        ).exec();
      })
      .then((dish) => {
        console.log(dish);
        dish.comments.push({
          rating: 5,
          comment: "New comment test",
          author: "New Author"
        })

        return dish.save();
      })
      .then((dish) => {
        console.log(dish);
        return Dishes.remove({});
      })
      .then(() => mongoose.connection.close())
      .catch((err) => console.log(err));
  });
