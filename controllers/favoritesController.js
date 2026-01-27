const axios = require("axios");
const favoritesRepository = require("../repositories/favoritesRepository");

class FavoritesController {
    async showFavoritesPage(req, res) {
        try {
            const userId = req.session.user.id;
            const query = req.query.q || "";

            const favorites = await favoritesRepository.getByUserId(userId);

            let results = [];

            if (query) {
                const ytRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                    params: {
                        key: process.env.YOUTUBE_API_KEY,
                        part: "snippet",
                        q: query,
                        type: "video",
                        maxResults: 8
                    }
                });

                results = ytRes.data.items.map(item => ({
                    videoId: item.id.videoId,
                    title: item.snippet.title,
                    thumbnailUrl: item.snippet.thumbnails?.medium?.url || "",
                    videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
                }));
            }

            res.render("favorites", {
                user: req.session.user,
                favorites,
                results,
                query
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error loading favorites page");
        }
    }


    async addFavorite(req, res) {
        try {
            const userId = req.session.user.id; // is your logged in user id (from authController)

            const { videoId, title, thumbnailUrl, videoUrl } = req.body;

            await favoritesRepository.addFavorite({
                userId,
                videoId,
                title,
                thumbnailUrl,
                videoUrl
            });

            res.redirect("/favorites");
        } catch (err) {
            // If user tries to add same video twice, UNIQUE constraint will throw
            console.error(err);
            res.redirect("/favorites");
        }
    }

    async deleteFavorite(req, res) {
        try {
            const userId = req.session.user.id;
            const favoriteId = Number(req.params.id);

            await favoritesRepository.deleteFavorite(favoriteId, userId);

            res.redirect("/favorites");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting favorite");
        }
    }
}

module.exports = new FavoritesController();
