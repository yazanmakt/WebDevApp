const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const favoritesController = require("../controllers/favoritesController");

// Show page (protected)
router.get("/favorites", requireAuth, favoritesController.showFavoritesPage);

// Add favorite (protected)
router.post("/favorites/add", requireAuth, favoritesController.addFavorite);

// Delete favorite (protected)
router.post("/favorites/delete/:id", requireAuth, favoritesController.deleteFavorite);

module.exports = router;
