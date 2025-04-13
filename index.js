const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();
const cron = require("node-cron");
const Parser = require("rss-parser");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const rss = new Parser();

const respostasZoeira = [
  "🤡 Isso aí é básico, né campeão?",
  "🔮 Pergunta de novo quando tu tiver sabedoria no olhar.",
  "🧠 Tô rodando em modo offline, mas ainda mais inteligente que muita gente.",
  "📉 Essa pergunta aí derrubou o Nasdaq.",
  "👽 Enquanto tu pensa, eu já pensei por você. Próximo.",
  "☠️ Tô rodando em modo caótico. Manda mais."
];

client.once("ready", () => {
  console.log(`🔥 JONES OFFLINE MODE ATIVADO como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // NOTÍCIA REAL ON DEMAND
  if (
    content.includes("tem notícia") ||
    content.includes("notícia aí") ||
    content.includes("qual a boa jones")
  ) {
    try {
      const feed = await rss.parseURL("https://techcrunch.com/feed/");
      const first = feed.items[0];
      message.channel.send(`📰 NOTÍCIA 📰\n**${first.title}**\n${first.link}`);
    } catch (err) {
      console.error("Erro ao puxar notícia:", err.message);
      message.channel.send("⚠️ Não consegui puxar notícia agora, chefe.");
    }
    return;
  }

  // PIADA EM PORTUGUÊS
  if (
    content.includes("piada") ||
    content.includes("me faz rir") ||
    content.includes("manda uma engraçada")
  ) {
    try {
      const res = await fetch("https://piadas-api.vercel.app/api/piadas");
      const piada = await res.text();
      message.channel.send(`😂 ${piada}`);
    } catch (err) {
      console.error("Erro ao puxar piada:", err.message);
      message.channel.send("❌ Erro ao buscar piada... zoeira abortada.");
    }
    return;
  }

  // ZOEIRA PADRÃO
  if (
    content.includes("jones") ||
    content.includes("jon jon") ||
    content.includes("underground")
  ) {
    const resposta = respostasZoeira[Math.floor(Math.random() * respostasZoeira.length)];
    message.channel.send(resposta);
  }
});

// NOTÍCIA REAL DIÁRIA ÀS 9H
cron.schedule("0 9 * * *", async () => {
  const canalId = "1277277564141834402"; // seu canal do Discord
  const canal = client.channels.cache.get(canalId);

  if (!canal) {
    console.error("⚠️ Canal não encontrado pra enviar a notícia.");
    return;
  }

  try {
    const feed = await rss.parseURL("https://techcrunch.com/feed/");
    const noticia = feed.items[0];
    await canal.send(`📰 NOTÍCIA DIÁRIA DE TI:\n**${noticia.title}**\n${noticia.link}`);
  } catch (err) {
    console.error("Erro ao puxar notícia diária:", err.message);
    canal.send("⚠️ Tentei mandar uma notícia real, mas a Matrix caiu.");
  }
});

client.login(process.env.DISCORD_TOKEN);
