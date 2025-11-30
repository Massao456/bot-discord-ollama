import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { Ollama } from 'ollama';
import fs from 'fs';

const ollama = new Ollama({
    host: 'https://ollama.com',
    headers: {
        Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY,
    },
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        if (message.mentions.has(client.user)) {
            await message.channel.sendTyping();

            const prompt = await fs.promises.readFile('./prompt.txt', 'utf8');

            const response = await ollama.chat({
                model: 'gpt-oss:120b-cloud',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: message.content },
                ],
            });
            message.reply(response.message.content);
        }
    } catch (err) {
        console.error('Erro no messageCreate:', err);
        message.reply('Ocorreu um erro ao processar sua mensagem.');
    }
});

client.login(process.env.TOKEN);
