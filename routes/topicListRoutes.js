const express = require("express");
const router = express.Router();
const topicListController = require("../controllers/topicListController");

router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
});

router.get("/", topicListController.getTopicList);

module.exports = router;
