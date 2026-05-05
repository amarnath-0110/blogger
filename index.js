import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = process.env.PORT || 3000;
var counter = 0;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {

    if (counter === 0) {
        return res.render("index.ejs", { posts: [] });
    }

    let posts = [];
    let filesRead = 0;

    for (let i = 1; i <= counter; i++) {
        const name = "files/file" + i + ".txt";

        fs.readFile(name, "utf8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            const lines = data.split("\n");
            const title = lines[0];
            const content = lines.slice(1).join("\n");

            posts.push({ title, content });

            filesRead++;

            // 👉 render ONLY when all files are read
            if (filesRead === counter) {
                res.render("index.ejs", { posts });
            }
        });
    }
});

app.get("/create", (req, res) => {
    res.render("post.ejs");
});
app.post("/submit", (req, res) => {
    console.log("hit");
    counter++;
    var fileNew = "files/file" + counter + ".txt";
    var thisSend = req.body.title + "\n" + req.body.content + "\n";
    fs.writeFile(fileNew, thisSend, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    res.redirect("/");
    console.log(req.body);
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});