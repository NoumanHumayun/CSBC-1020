const express = require("express");
const router = express.Router();
const { validateNote } = require("../utils/validators");
const connection = require("../database");

//use SQL current timestamp function
const CURRENT_TIMESTAMP = {
  toSqlString: function () {
    return "CURRENT_TIMESTAMP()";
  },
};

/* ------------------------ TODO-4 - Create New Note ------------------------ */
router.post("/", (req, res) => {
  console.log(
    `[POST] http://localhost:${global.port}/note - Storing a new note`
  );

  const note = {
    text: req.body.text,
    dateCreated: CURRENT_TIMESTAMP,
    lastModified: CURRENT_TIMESTAMP,
  };

  connection.query(
    "INSERT INTO notes SET ?",
    note,
    function (error, results, fields) {
      if (error) res.status(500).send("Fail to insert");
      connection.query(
        "SELECT * FROM notes WHERE id = ?",
        results.insertId,
        function (error, output, fields) {
          if (error) res.status(500).send("Fail to fetch");
          if (!validateNote(output[0])) {
            res.status(500).send("Invalid data type");
          }
          res.status(201).send({ newNote: output[0] });
        }
      );
    }
  );
});
/* -------------------------------------------------------------------------- */

/* ------------------------- TODO-5 - Update A Note ------------------------- */
router.put("/", (req, res) => {
  console.log(`[PUT] http://localhost:${global.port}/note - Updating note`);

  const noteId = req.body.id;
  const newText = req.body.text;

  connection.query(
    {
      sql: "UPDATE `notes` SET `text` = ? , `lastModified` = ? WHERE `id` = ?",
      values: [newText, CURRENT_TIMESTAMP, noteId],
    },
    function (error, results, fields) {
      if (error || !results.affectedRows)
        res.status(500).send("Fail to update");
      connection.query(
        "SELECT * FROM notes WHERE id = ?",
        noteId,
        function (error, output, fields) {
          if (error) res.status(500).send("Fail to fetch");
          if (!validateNote(output[0])) {
            res.status(500).send("Invalid data type");
          }
          res.send({ updatedNote: output[0] });
        }
      );
    }
  );
});
/* -------------------------------------------------------------------------- */

/* ------------------------- TODO-6 - Delete A Note ------------------------- */
router.delete("/", (req, res) => {
  console.log(`[DELETE] http://localhost:${global.port}/note - Deleting note`);

  /*
	  TODO-6:
      Given a note id
		  Delete note with the given id from the database

		  Note id is stored in variable noteId 
	*/
  const noteId = req.body.id;
  connection.query(
    {
      sql: "DELETE FROM `notes` WHERE `id` = ?",
      values: [noteId],
    },
    function (error, results, fields) {
      if (error || !results.affectedRows)
        res.status(500).send("Fail to delete");
      res.send("Successfully Deleted!");
    }
  );
});
/* -------------------------------------------------------------------------- */

module.exports = router;
