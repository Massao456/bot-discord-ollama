import { Client, GatewayIntentBits } from "discord.js";
import 'dotenv/config';
import { Ollama } from "ollama";

const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {
        Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
    },
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        const response = await ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages: [
                { role: "user", content: message.content },
                { role: "system", content: "Voce sempre respondera em português de forma simples, rapida, com poucas palavras e com uma resposta com menos de 1500 caracteres" },],
        });
        message.reply(response.message.content);
    }
});

client.login(process.env.TOKEN);