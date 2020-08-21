require("dotenv").config();
const path = require("path");
const express = require("express");
const { json } = require("body-parser");
const compression = require("compression");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

const app = express()
  .use(json())
  .use(compression())
  .use(express.static(path.resolve("build")));

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2019-07-12",
  authenticator: new IamAuthenticator({ apikey: API_KEY }),
  url: URL,
});

app.post("/api/watson-nlu", async (req, res) => {
  try {
    const response = await naturalLanguageUnderstanding.analyze(req.body);
    res.send(response.result);
  } catch (error) {
    res.send(error);
  }
});

app.get("*", ({}, res) => res.sendFile(path.resolve("build/index.html")));

app.listen(PORT, () => {
  process.stdout.write(`Express server listening on port ${PORT}\n`);
});
