import { Client, Interaction } from "discord.js";
import { getHighscores, getUserScore, setUserScore } from "../db/DB";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() && interaction.commandName == 'golf') {
            const user = interaction.user
            switch (interaction.options.getSubcommand(false)){
                case 'plus':
                    const increase = interaction.options.getInteger('value') || 0
                    const scoreUp = await setUserScore(user.id, user.username, increase)
                    let reply = `**${user.username}s golf score is now ${scoreUp.score}.** (+${increase})`
                    if ( scoreUp.place != scoreUp.oldPlace && scoreUp.oldPlace != -1){
                        reply += `\nNow placed ${makePlace(scoreUp.place)} (down by ${scoreUp.place - scoreUp.oldPlace} places).` 
                    } else if ( scoreUp.oldPlace == -1 ) {
                        reply += `\nNow placed ${makePlace(scoreUp.place)} (new on the board).`
                        reply += `\nWelcome ${user.username} to the competition!`
                        if ( increase > 50 ){
                            reply += rulesText;
                        }
                    }
                    await interaction.reply(reply)
                    break
                case 'minus':
                    const decrease = ( interaction.options.getInteger('value') || 0 ) * -1 
                    const scoreDown = await setUserScore(user.id, user.username, decrease)
                    let replyDown = `**${user.username}s golf score is now ${scoreDown.score}.** (${decrease})`
                    if ( scoreDown.place != scoreDown.oldPlace && scoreDown.oldPlace != -1){
                        replyDown += `\nNow placed ${makePlace(scoreDown.place)} (up by ${scoreDown.oldPlace - scoreDown.place} places).` 
                    } else if ( scoreDown.oldPlace == -1 ) {
                        replyDown += `\nNow placed ${makePlace(scoreDown.place)} (new on the board).`
                        replyDown += `\nWelcome ${user.username} to the competition!`
                        if ( decrease > 50 ){
                            replyDown += rulesText;
                        }
                    }
                    await interaction.reply(replyDown)
                    break
                case 'score': 
                    const score = await getUserScore(user.id)
                    await interaction.reply({content: `**${user.username}s score is ${score}**`})
                    break    
                case 'highscores': 
                    await interaction.reply(await formatHighscores())
                    break
                case 'rules': 
                    await interaction.reply(rulesText)
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

const makePlace = (score: number) => {
    if ( score == 1){
        return 'first'
    } else if ( score == 2 ){
        return 'second'
    } else if ( score == 3 ){
        return 'third'
    } else return `${score}th`
}

const passedUserString = ( passedUsers: string[]) => {
    let reply = ''
    passedUsers.forEach( (username, index) => {
        reply += ` ${username}`
        if ( index == passedUsers.length - 2){
            reply += ' and'
        } else if ( index < passedUsers.length -1 ){
            reply += ','
        }
    })
    return reply
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
    })
    reply += separator
    reply += "```"
    return reply
}

const rulesText = 
 "**Miniature Golf Rules**\n\n"+
 "Points are gained at +1 per model **recieved in the season**, and an additional +1 if the model was bought within 30 days of its release.\n"+ 
 "3D printing files are not scored until they have been printed, so feel free to stockpile those digital sculpts!\n"+
 "As soon as you completely finish a model, score -1 point! If you give/sell a model away, painted or unpainted, score -1 point!\n"+
 "If it's a model that was doubly counted due to release you can score an additional -1 point if it was completed within 30 days of acquisition.\n"+
 "Feel free to ask if there are any seasonal modifiers, such as holiday or grand alliance themes.\n\n"+

 "_What counts as a model?_\n Any miniature that could be considered a singular object, such as a barricade, a figure on a multibase, or an objective token.\n\n"+
 "_What if I take commissions?_\n Score +1 point when the model is given to you, -1 pt when you finish painting it, and -1 pt when you give it back to the person who commissioned you.\n\n"+ 
 "_What if I'm gifted a model?_\n If you intend to paint it, add it to your score. If you paint then *do* paint it, you do not get the -1 pt obviously. This also includes board games and kitbashing fodder.\n\n"+
 "**Happy golfing!**"