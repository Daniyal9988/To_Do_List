import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TO_do",
  password: "123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {

try {
  const result = await db.query("SELECT * FROM list ORDER BY id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
} catch (error) {
  console.log(err);
}
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO list(task_name) VALUES($1)",[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

app.post("/edit", async(req, res) => {
  const updatedItem =  req.body.updatedItemTitle;
  const updatedId = req.body.updatedItemId;
  try {
    await db.query("UPDATE list SET task_name = ($1) WHERE id = ($2)",[updatedItem,updatedId])
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM list WHERE id = ($1)",[id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
