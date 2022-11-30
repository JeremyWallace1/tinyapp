const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
app.set("view engine", "ejs");

const PORT = 8080; // default port 8080
const crypto = require("crypto");
const { clear } = require("console");

const generateRandomString = function() {
  let result = crypto.randomBytes(3).toString('hex');
  console.log(result);
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// middleware pieces
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// EDGE CASE: may want to add in something to check if it starts with http:// or not, like: if (urlDatabase[shortName])

// DELETE (done as POST, but ideally done as DELETE due to browser limitations)
app.post("/urls/:id/delete", (req, res) => {
  // console.log(`${req.params.id} has been deleted.`); // Log the POST request body to the console
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// UPDATE (done as POST, but ideally done as PUT due to browser limitations)
app.post("/urls/:id", (req, res) => {
  //rewrite the entry in urlDatabase for the id passed using the body passed const id = req.params.id;
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// add an endpoint to handle a POST to /login in your Express server
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username); // I think this is async
  console.log('Cookies: ', req.cookies); // so this is coming before the new value
  res.redirect("/urls");
});

// add an endpoint to handle a POST to /logout in your Express server
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username); // I think this is async
  console.log('Cookies: ', req.cookies); // so this is coming before the new value
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  const shortName = generateRandomString();
  urlDatabase[shortName] = req.body.longURL;
  //console.log(urlDatabase);
  const templateVars = { id: shortName, longURL: urlDatabase[shortName] };
  res.render("urls_show", templateVars);
});

// The order of route definitions matters!
app.get("/", (req, res) => { // request and response
  res.send("Hello!");
});

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_register", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  // console.log(longURL);
  res.redirect(longURL);
});

// EDGE CASE: what if cx requests a short URL with a non-existant id?
app.get("/urls/:id", (req, res) => {
  const templateVars = { username: req.cookies["username"], id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});