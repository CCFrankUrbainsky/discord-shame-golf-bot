import { Client, Intents } from "discord.js";

import ready from "./src/listeners/ready";
import interactionCreate from "./src/listeners/interactionCreate";

const { token } = require("./data/config.json");

console.log("Bot is starting...");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

ready(client);
interactionCreate(client);

client.login(token);
