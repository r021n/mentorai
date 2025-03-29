exports.getTopicList = (db, callback) => {
  const sql = "SELECT * FROM topics";
  db.all(sql, [], callback);
};
