# Shame be upon us! Golf git is here.

This is a discord bot based on the awesome guide at https://discordjs.guide.

It needs nodeJS 16+ installed to run.

To get it to run you need to create a 'config.json' file in the data of the application.
You can copy the config.json.example file for a template.
There you need to fill in the needed details:

```
{
    "token": "your bot token (from the discord dev portal) goes here",
    "guildId": "the id of the server the bot shall operate on goes here",
    "clientId": "the application id (from the discord dev portal) goes here",
    "channelId": "the id of the channel the bot shall post the highscore tables in goes here"
}
```

To get the ids of server and channel. Go into your discord user settings and activate developer mode under the advanced tab.
Then you can right click the server and channel to get the ids.

For the bot to fully function it needs the following permissions on the server it is going to run:

* applications.commands
* bot > Send Messages

![Screenshot of permissions in the discord dev portal](https://i.imgur.com/broHKxN.png)

Send the Oauth Link to an operator of the server to accept it. 

## Installation instructions

```
npm i  # installs the dependencies
npm run deploy:commands  # registers the bots commands with discord
npm start # starts the bot
```

Now your bot should be available on the server whose id you entered in the config.json file! Huzzah!

For permanent running I advise you to wrap the execution of the code into pm2 or a comparable process monitor.

## Usage

The bot has the following commands:

```
/golf  :  Teaches you about the basic features of the bot.
/golf plus [number] : increases the score of the user that typed the command by [number].
/golf minus [number] : dencreases the score of the user that typed the command by [number].
/golf score : Displays the score of the user that typed the command for all to read.
/golf highscore : Prints a highscore table into the channel.
```

The bot will post the highscore table on its own every first and 15th of each month.
Also the table will be reset every season. Meaning the 15th of March, June, September and December.

Happy golfing!