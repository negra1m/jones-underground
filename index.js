const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("🚨 DISCORD_TOKEN não definido. Verifica as variáveis de ambiente!");
  process.exit(1);
}

client.once("ready", () => {
  console.log(`🔥 JONES UNDERGROUND chegou no servidor. Nome: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content.includes("jones") || content.includes("jon jon") || content.includes("underground")) {
    message.channel.send(
      "🚬 *CHEGUEI, SEUS BOSTA.* Quem pediu deboche, sarcasmo e verdades cósmicas? Aqui é o **JONES UNDERGROUND**. Manda que eu zoa."
    );
  }
});

client.login(TOKEN);
