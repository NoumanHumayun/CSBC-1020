const express = require("express");
const router = express.Router();
const { validateNoteArray } = require("../utils/validators");
const connection = require("../database");

/* ------------------------ TODO-3 - Fetch All Notes ------------------------ */
router.get("/", (req, res) => {
  console.log(
    `[GET] http://localhost:${global.port}/notes - Fetching all notes`
  );

  connection.query("SELECT * FROM notes", function (error, results, fields) {
    if (error) res.status(500).send("Fail to query");
    if (!validateNoteArray(results)) {
      res.status(500).send("Invalid data type");
    }
    res.send({notes: results});
  });
});
/* -------------------------------------------------------------------------- */

/* ------------------------- TODO-7 - Search Notes -------------------------- */
router.get("/search/:searchKey", (req, res) => {
  console.log(
    `[GET] http://localhost:${global.port}/notes/search - Searching notes`
  );

  //Add Wildcard to search key
  const searchKey = `%${req.params.searchKey}%`;

  connection.query(
    "SELECT * FROM notes WHERE `text` LIKE ? ",
    [searchKey],
    function (error, results, fields) {
      if (error) res.status(500).send("Fail to query");
      if (!validateNoteArray(results)) {
        res.status(500).send("Invalid data type");
      }
      res.send({notes: results});
    }
  );
});
/* -------------------------------------------------------------------------- */

/* ----------------------- TODO-8 - Delete All Notes ------------------------ */
router.delete("/", (req, res) => {
  console.log(
    `[DELETE] http://localhost:${global.port}/notes - Deleting all notes`
  );

  connection.query(
    "DELETE FROM notes WHERE 1 ",
    function (error, results, fields) {
      if (error) res.status(500).send("Fail to query");

      res.send("Table Truncated Succesfully");
    }
  );
});
/* -------------------------------------------------------------------------- */

module.exports = router;
