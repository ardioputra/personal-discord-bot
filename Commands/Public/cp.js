const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cp")
    .setDescription("Free Child Porn for MAP, MAP Pride!! ❤🧡💛💚💕"),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction) {
    interaction.reply({
      content:
        "You have a kiddie porn in your computer?!, You Are Under Arrest!",
    });
  },
};
