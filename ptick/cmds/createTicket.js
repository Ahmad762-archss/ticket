const ticketModel = require('../models/ticket');

module.exports = async (message, user) => {
    const ticketChannel = await message.guild
        .channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    id: user.id
                },
                {
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    id: message.guild.id
                }
            ]
        }
    );

    const msg = await ticketChannel.send({
        embed: {
            color: 'BLUE',
            description: 'Support will be with you shortly.\n \nTo close this ticket react with 🔒',
        }
    });

    msg.react('🔒');

    const ticketDoc = new ticketModel({
        guildID: message.guild.id,
        userID: user.id,
        ticketID: ticketChannel.id,
        ticketStatus: false,
        msgID: msg.id
    });

    await ticketDoc.save();
};