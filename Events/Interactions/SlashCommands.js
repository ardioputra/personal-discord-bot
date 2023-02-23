const { ChatInputCommandInteraction } = require("discord.js");
const { subCommand } = require("../../Commands/Developer/Reload/commands");

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: "This command is outdated",
                phemeral: true,
            });
        if (command.developer && interaction.user.id !== "625354932773715998")
            return interaction.reply({
                content: "This command is only available to the developer.",
                ephemeral: true,
            });

        const isSubCommand = interaction.options.getSubcommand(false);
        if (isSubCommand) {
            const subCommandFile = client.subCommands.get(
                `${interaction.commandName}.${isSubCommand}`
            );
            if (!subCommandFile)
                return interaction.reply({
                    content: "This sub command doesn't exist",
                    ephemeral: true,
                });
            subCommandFile.execute(interaction, client);
        } else command.execute(interaction, client);
    },
};