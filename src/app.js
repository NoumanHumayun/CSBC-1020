const config = require("dotenv").config();
const cors = require("cors");
const express = require("express");

const healthRouter = require("./routes/health");
const notesRouter = require("./routes/notes");
const noteRouter = require("./routes/note");
const connection = require("./database");

if (config.error) {
  throw config.error;
}

const port = process.env.PORT; // || 3001
global.port = port;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
  TODO-1: Settup Database connection
*/

/*
  TODO-2: Upon database connection success, create the relavent table(s) if it does not exist.
*/

app.get("/", (req, res) => {
  res.send("CSBC1010 Assignment 3 - My Notes");
});

app.use("/health", healthRouter);
app.use("/notes", notesRouter);
app.use("/note", noteRouter);

connection.connect(function (err) {
  if (err) throw err;
  console.log("DB connected");
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
  connection.query(
    "CREATE TABLE IF NOT EXISTS `assignment3`.`notes` ( " +
      "`id` INT NOT NULL AUTO_INCREMENT ," +
      " `text` VARCHAR(250) NULL ," +
      " `dateCreated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ," +
      " `lastModified` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ," +
      " PRIMARY KEY (`id`))",
    function (error, results, fields) {
      if (error) throw error;
      console.log("TABLE CREATED");
    }
  );
});
