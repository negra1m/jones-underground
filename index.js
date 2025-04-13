const { Client, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAIApi(
  new Configuration({
    apiKey: OPENAI_API_KEY,
  })
);

if (!DISCORD_TOKEN || !OPENAI_API_KEY) {
  console.error("❌ Tokens não definidos.");
  process.exit(1);
}

client.once("ready", () => {
  console.log(`🔥 JONES UNDERGROUND online como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content.includes("jones") || content.includes("jon jon") || content.includes("underground")) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Você é JONES UNDERGROUND, um bot sarcástico, debochado, com gírias e respostas místicas de zoeira fina.",
          },
          {
            role: "user",
            content: message.content,
          },
        ],
      });

      const reply = response.data.choices[0].message.content;
      message.channel.send(reply);
    } catch (err) {
      console.error("Erro ao chamar OpenAI:", err);
      message.channel.send("⚠️ Deu ruim, mano. Tenta de novo ou chama o Vini.");
    }
  }
});

client.login(DISCORD_TOKEN);
