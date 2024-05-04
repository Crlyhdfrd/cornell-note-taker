const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  const filePath = path.join(__dirname, "db", "db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const filePath = path.join(__dirname, "db", "db.json");
  const maxIdFilePath = path.join(__dirname, "db", "maxId.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    const notes = JSON.parse(data);
    const newNote = req.body;

    fs.readFile(maxIdFilePath, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      const maxId = JSON.parse(data);
      console.log(maxId);
      newNote.id = "" + (parseInt(maxId) + 1) ;
      console.log(newNote);
      notes.push(newNote);

      fs.writeFile(maxIdFilePath, JSON.stringify(newNote.id), (err) => {
        if (err) {
          return console.log(err);
        }
      });

      fs.writeFile(filePath, JSON.stringify(notes), (err) => {
        if (err) {
          return console.log(err);
        }
        res.json(newNote);
      });
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const filePath = path.join(__dirname, "db", "db.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    const notes = JSON.parse(data);
    const id = req.params.id;

    const filteredNotes = notes.filter((note) => note.id !== id);

    fs.writeFile(filePath, JSON.stringify(filteredNotes), (err) => {
      if (err) {
        return console.log(err);
      }
      res.json({ ok: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
