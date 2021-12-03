import { Client, TextChannel } from "discord.js";
import { formatHighscores } from "./interactionCreate";
import * as cron from "node-cron"
import { resetHighscores } from "../db/DB";
const { channelId } = require('../../config.json');

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        console.log(`${client.user.username} is online`);
    });

    let postSchedule = true

    // post highscores bi-monthly
    cron.schedule("3 0 1,15 * *",  async ()=>{
        if ( !postSchedule ) { // stops doubleposting after reset
            postSchedule = true
            return
        }
        const channel = client.channels.cache.get(channelId) as TextChannel
        channel.send(await formatHighscores())
    })

    // post highscores bi-monthly
    cron.schedule("0 0 15 3,6,9,12 *",  async ()=>{
        const channel = client.channels.cache.get(channelId) as TextChannel
        channel.send('A new season begins! This seasons')
        channel.send(await formatHighscores())
        await resetHighscores()
        channel.send('All stats have been purged. Rejoice!')
        postSchedule = false
    })
};