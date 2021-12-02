import { Client, Interaction } from "discord.js";
import { getHighscores, getUserScore, setUserScore } from "../db/DB";

const userPoints : Map<string, number> = new Map()
const users: Map<string, string> = new Map()

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() && interaction.commandName == 'golf') {
            const user = interaction.user
           
            switch (interaction.options.getSubcommand(false)){
                case 'plus':
                    const increase = interaction.options.getInteger('value') || 0
                    const scoreUp = await setUserScore(user.id, user.username, increase)
                    await interaction.reply(`**${user.username}s golf score is now ${scoreUp}.** (+${increase})`)
                    break
                case 'minus':
                    const decrease = ( interaction.options.getInteger('value') || 0 ) * -1 
                    const scoreDown = await setUserScore(user.id, user.username, decrease)
                    await interaction.reply(`**${user.username}s golf score is now ${scoreDown}.** (${decrease})`)
                    break
                case 'score': 
                    const score = await getUserScore(user.id)
                    await interaction.reply(`**${user.username}s score is ${score}**`)
                    break    
                case 'highscores': 
                    await interaction.reply(await formatHighscores())
                    break
                default:
                    await interaction.reply({ content: '**Thanks for using Golf Git!** Please use the subcommands:\n/\golf plus X  to add to your score\n/\golf minus X to substract from your score\n\nGit gud!', ephemeral: true } )
            }
        }
    });
};

const fillString = (name : string, size : number) => {
    while (name.length < size  ){
        name += " "
    }
    return " " + name.substring(0, size) + " "
}

const fillScore = (score : number, size : number) => {
    let name = score + ""
    while (name.length < size  ){
        name = " " + name
    }
    return " " + name.substring(0, size) + " "
}

export const formatHighscores = async () =>{
    const highscores = await getHighscores()
    const nameLength = 25
    const scoreLength = 5
    const lineChar = '-'
    let reply = "**Highscores**\n```\n"
    const separator =  `+${lineChar.repeat(nameLength+2)}+${lineChar.repeat(scoreLength+2)}+\n`
    reply += separator
    reply += `|${fillString('Name',nameLength)}|${fillString('Score',scoreLength)}|\n`
    reply += separator
    highscores.forEach( line => {
        reply += `|${fillString(line.name, nameLength)}|${fillScore(line.score, scoreLength)}|\n`
        reply += separator
    })
    reply += "```"
    return reply
}