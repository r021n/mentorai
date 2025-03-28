const topicModel = require("../models/topicModel");

exports.getTopics = (req, res) => {
  const db = req.db;
  topicModel.getTopics(db, (err, rows) => {
    if (err) {
      return res.send("Terjadi error saat mengambil data topik");
    }

    res.render("topics/listTopics", { topics: rows });
  });
};

exports.getAddTopic = (req, res) => {
  res.render("topics/addTopic", { error: null });
};

exports.postAddTopic = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.render("topics/addTopic", { error: "Nama topik harus diisi" });
  }

  const db = req.db;
  topicModel.insertTopic(db, name, (err) => {
    if (err) {
      return res.render("topics/addTopic", {
        error: "Terjadi kesalahan saat menambahkan topik",
      });
    }

    res.redirect("/topics");
  });
};

exports.getEditTopic = (req, res) => {
  const id = req.params.id;
  const db = req.db;
  topicModel.getTopicById(db, id, (err, topic) => {
    if (err || !topic) {
      return res.redirect("/topics");
    }

    res.render("topics/editTopic", { error: null, topic });
  });
};

exports.postEditTopic = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  if (!name) {
    return res.render("topics/editTopic", {
      error: "Nama topik harus diisi",
      topic: { id, name },
    });
  }

  const db = req.db;
  topicModel.updateTopic(db, id, name, (err) => {
    if (err) {
      return res.render("topics/editTopic", {
        error: "Terjadi error saat memperbarui topic",
        topic: { id, name },
      });
    }
    res.redirect("/topics");
  });
};

exports.postDeleteTopic = (req, res) => {
  const id = req.params.id;
  const db = req.db;
  topicModel.deleteTopic(db, id, (err) => {
    if (err) {
      return res.send("Terjadi error saat menghapus topik");
    }
    res.redirect("/topics");
  });
};
