const express = require("express");
const mongo = require("mongodb").MongoClient;
const url = "mongodb+srv://notesDatabase:notesDatabasePpassword@cluster0.xo77i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const app = express();
app.use(express.json());

const chechIsNoteCorrect = (note) => {
    if (note && "id" in note && "title" in note && description in note) {
        return true;
    } else {
        return false
    };
};

const handleRoot = (_, res) => {
    res.end("Server is working!");
};

const handleAddNote = (req, res, db) => {
    const isCorrect = chechIsNoteCorrect(req.body);
    if (isCorrect) {
        if (db) {
            const {id, title, description}= req.body;
            const newNote = {id, title, description};
            db
                .collection("Notes")
                .insertOne(newNote)
                .then(data => {
                    res.statusCode = 201;
                    res.end("Note successully added");
                })
                .catch(e => {
                    console.warn("handleAddNote", e);
                    res.statusCode = 500;
                    res.end("Error adding note");
                });
        } else {
            res.end("Cannot connect to database");
        }
    } else {
        res.statusCode = 400;
        res.end("Not valid data");
    }
    res.end("OK");
};

const handleDelete = (req, res, db) => {
    if (req.body.id) {
        const { id } = req.body;
        db
            .collection("Notes")
            .deleteOne({id})
            .then(_ => {
                res.statusCode = 200;
                res.end("Note is deleted!");
            })
            .catch(e => {
                res.statusCode = 500;
                res.end("Error deleting note!");
                console.warn("handleDelete", e);

            })
    } else {
        res.statusCode = 400;
        res.end("Not valid data!");
    };
};

const handleEdit = (req, res, db) => {

};

mongo.connect(url, (err, client) => {
    if (err) return err;

    const db = client.db("NotesDatabase");

    app.get("/", handleRoot);
    app.post("/note", (req, res) => handleAddNote(req, res, db));
    app.delete("/note", (req, res) => handleDelete(req, res, db));
    app.put("/note", (req, res) => handleEdit(req, res, db));

    app.listen(3025, () => {
        console.log("Listening on port 3025...");
    });
});