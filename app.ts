import { Client, Intents } from "discord.js";
import interactionCreate, {
  formatHTMLHighscores,
} from "./src/listeners/interactionCreate";
import ready from "./src/listeners/ready";
import express from "express";

const { token } = require("./config.json");

console.log("Bot is starting...");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// this blog is for MS Azure, keepalive on the free tier is done via health checks on port 8080
const keepaliveServer = express();
keepaliveServer.get("/", async function (req, res) {
  res.send(`<html><body>${await formatHTMLHighscores()}</body></html>`);
});
keepaliveServer.listen(8080);
// /MS Azure health check

ready(client);
interactionCreate(client);

const expres = client.login(token);
