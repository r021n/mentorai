const topicListModel = require("../models/topicListModel");

exports.getTopicList = (req, res) => {
  const db = req.db;
  topicListModel.getTopicList(db, (err, topics) => {
    if (err) {
      return res.status(500).send("error mendapatkan topik");
    }

    res.render("topicList", { topics });
  });
};
