const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorites = require("../models/favorites");

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

favoritesRouter
  .options(cors.corsWithOptions, (_, res) => {
    res.sendStatus(200);
  })
  .route("/")
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .exec((err, favorites) => {
        if (err) {
          next(err);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        }
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const user = req.user._id;

    Favorites.findOne({ user }).then(
      (favorites) => {
        const dishes = req.body.map((dish) => dish._id);

        if (favorites) {
          const sizeFavoritesBefore = favorites.dishes.length;

          dishes.forEach((dishId) => {
            if (!favorites.dishes.includes(dishId)) {
              favorites.dishes.push(dishId);
            }
          });

          if (favorites.dishes.length > sizeFavoritesBefore) {
            favorites.save().then(
              (favorites) => {
                if (favorites) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorites);
                } else {
                  next(err);
                }
              },
              (err) => next(err)
            );
          } else {
            res.statusCode = 400;
            res.end("All provided dishes are already in the favorites.");
          }
        } else {
          Favorites.create({ user, dishes }).then(
            (favorites) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorites);
            },
            (err) => next(err)
          );
        }
      },
      (err) => next(err)
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
      .then(
        (resp) => {
          if (resp) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favoritesRouter
  .options(cors.corsWithOptions, (_, res) => {
    res.sendStatus(200);
  })
  .route("/:dishId")
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const user = req.user._id;

    Favorites.findOne({ user }).then(
      (favorites) => {
        if (favorites) {
          const dishId = req.params.dishId;
          if (favorites.dishes.includes(dishId)) {
            res.statusCode = 400;
            res.end(`Dish with id ${dishId} is already in favorites`);
          } else {
            favorites.dishes.push(dishId);
            favorites.save().then(
              (favorites) => {
                if (favorites) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorites);
                } else {
                  next(err);
                }
              },
              (err) => next(err)
            );
          }
        } else {
          res.statusCode = 400;
          res.end("User does not have a favorites. Create one first");
        }
      },
      (err) => next(err)
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const user = req.user._id;

    Favorites.findOne({ user }).then(
      (favorites) => {
        if (favorites) {
          const dishIdToRemove = req.params.dishId;
          favorites.dishes = favorites.dishes.filter(
            (dishId) => !dishId.equals(dishIdToRemove)
          );
          favorites.save().then(
            (favorites) => {
              if (favorites) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorites);
              } else {
                next(err);
              }
            },
            (err) => next(err)
          );
        } else {
          res.statusCode = 400;
          res.end("User does not have a favorites.");
        }
      },
      (err) => next(err)
    );
  });

module.exports = favoritesRouter;
