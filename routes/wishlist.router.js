const express = require('express');

const verifyUser = require("../middleware/verfiyuser");

const wishlistController = require("../controllers/wishlistController");

const { createWishlistHandler, deleteWishlistHandler, getWishlistHandler } = wishlistController;

const router = express.Router();

router.route("/")
    .post(createWishlistHandler)

router.route("/:id")
    .delete(verifyUser, deleteWishlistHandler)

router.route("/")
    .get(getWishlistHandler)

module.exports = router;