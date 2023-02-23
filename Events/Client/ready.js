const { Client } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  execute(client) {
    console.log("The Client is Ready.");
    loadCommands(client);
  },
};
