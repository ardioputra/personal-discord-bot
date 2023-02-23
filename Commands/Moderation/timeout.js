const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");

const Database = require("../../Schemas/infractions");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Mute members")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption((options) =>
            options
            .setName("target")
            .setDescription("Select the member you want to mute")
            .setRequired(true)
        )
        .addStringOption((options) =>
            options
            .setName("duration")
            .setDescription("Insert the duration")
            .setRequired(true)
        )
        .addStringOption((options) =>
            options
            .setName("reason")
            .setDescription("Why timeout this member?")
            .setMaxLength(512)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { options, guild, member } = interaction;
        const target = options.getMember("target");
        const duration = options.getString("duration");
        const reason = options.getString("reason") || "You did something silly!";

        const errorsArray = {};

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not timeout member due to" })
            .setColor("Red");

        if (!target)
            return interaction.reply({
                embeds: [
                    errorsEmbed.setDescription("Member has likely left the guild"),
                ],
                ephemeral: true,
            });
        if (!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("Time provided is invalid or over 28d limit.");

        if (!target.manageable || !target.moderatable)
            errorsArray.push("Selected target is not moderatable by this bot");

        if (member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("Target role higher than your role!");

        if (errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true,
            });

        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply({
                embeds: [errorsEmbed.setDescription("Error")],
            });
            return console.log("Error occured in timeout.js", err);
        });

        const newInfractionObject = {
            IssureID: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now(),
        };

        let userData = await Database.findOne({ Guild: guild.id, User: target.id });
        if (!userData)
            userData = await Database.create({
                Guild: guild.id,
                User: target.id,
                Infractions: [newInfractionObject],
            });
        else
            userData.Infractions.push(newInfractionObject) && (await userData.save());

        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: "Timeout Issues", iconURL: guild.iconURL() })
            .setColor("Gold")
            .setDescription(
                [
                    `${target} was muted for **${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
                    `${target} got ${userData.Infractions.length} silly points`,
                    `\n Reason: ${reason}`,
                ].join("\n")
            );
        return interaction.reply({ embeds: [successEmbed] });
    },
};