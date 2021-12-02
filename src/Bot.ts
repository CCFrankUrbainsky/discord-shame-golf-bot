import { Client, Intents } from "discord.js"
import interactionCreate from "./listeners/interactionCreate"
import ready from "./listeners/ready"

const { token } = require('../config.json');

console.log("Bot is starting...");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

ready(client)
interactionCreate(client)

client.login(token)