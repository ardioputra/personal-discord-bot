const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");
client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

const { connect } = require("mongoose");
connect(client.config.DatabaseURL, {}).then(() =>
  console.log("The client is now connected to the database")
);

client
  .login(client.config.token)
  .then(() => {
    console.log(`Client logged in as ${client.user.username}`);
    client.user.setActivity("with SVU Deparement");
  })
  .catch((err) => console.log(err));
