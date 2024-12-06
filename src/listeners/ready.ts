import { Client, TextChannel } from "discord.js";
import { formatHighscores } from "./interactionCreate";
import * as cron from "node-cron";
import { resetHighscores } from "../db/DB";
const { channelId } = require("../../data/config.json");

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    console.log(`${client.user.username} is online`);
  });

  let postHighscoreTable = true;

  // post highscores bi-monthly
  cron.schedule("3 0 1,15 * *", async () => {
    if (!postHighscoreTable) {
      // stops doubleposting after reset
      postHighscoreTable = true;
      return;
    }
    const channel = client.channels.cache.get(channelId) as TextChannel;
    channel.send(await formatHighscores());
  });

  // posts final highscore at season end and then resets the board
  cron.schedule("0 0 1 1,4,7,10 *", async () => {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    channel.send("A new season begins! This seasons");
    channel.send(await formatHighscores());
    await resetHighscores();
    channel.send("All stats have been purged. Rejoice!");
    postHighscoreTable = false;
  });
};
