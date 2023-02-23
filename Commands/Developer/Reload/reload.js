const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
} = require("discord.js");

const { loadCommands } = require("../../../Handlers/commandHandler");
const { loadEvents } = require("../../../Handlers/eventHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload your command/events")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
            options.setName("events").setDescription("Reload your events")
        )
        .addSubcommand((options) =>
            options.setName("commands").setDescription("Reload your commands")
        ),
};