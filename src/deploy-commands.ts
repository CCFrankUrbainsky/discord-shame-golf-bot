const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
	new SlashCommandBuilder()
	.setName('golf')
	.setDescription('Take part in our shame golf')
	.addSubcommand((subcommand:any) =>
		subcommand
			.setName('plus')
			.setDescription('Increase your golf score. Shaaame!')
			.addIntegerOption((option:any) => option.setName('value').setDescription('Amount to increase').setRequired(true)))
	.addSubcommand((subcommand: any) =>
		subcommand
			.setName('minus')
			.setDescription('Decrease your golf score. Nice!')
            .addIntegerOption((option:any) => option.setName('value').setDescription('Amount to decrease').setRequired(true)))
    .addSubcommand((subcommand:any) =>
        subcommand
            .setName('highscores')
            .setDescription('Displays the highscore table.'))
			.addBoolOption((option:any) => option.setName('silent').setDescription('Show the table only to yourself').setRequired(false))
	.addSubcommand((subcommand:any) =>
			subcommand
				.setName('score')
				.setDescription('Displays your score.'))
	.addSubcommand((subcommand:any) =>
			subcommand
				.setName('rules')
				.setDescription('Displays the rules used in shame golf.'))		
    ]                 
	.map(command => command.toJSON());
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);