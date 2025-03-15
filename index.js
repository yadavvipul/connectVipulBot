require("dotenv").config();
const axios = require("axios");

const TelegramBot = require("node-telegram-bot-api");
const chatData = require("./data.json"); // Your local JSON file

const TOKEN = process.env.TOKEN; // Fetch token from .env file
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const bot = new TelegramBot(TOKEN, { polling: true });

// Send Help Message on Start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    sendHelpMessage(chatId);
  });
  
  // Send Help Message When a User Joins the Chat
  bot.on("new_chat_members", (msg) => {
    const chatId = msg.chat.id;
    sendHelpMessage(chatId);
  });

// 📖 Help Command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `🤖 *Welcome to the Telegram Bot!*
  
  Here are the commands you can use:
  
  🔍 *Search Contact Info:* Just type a name to find contact details.
  📧 *Email Templates:* Use /email [type] (e.g., /email requesting leave)
  📄 *Document Templates:* Use /doc [type] (e.g., /doc meeting notes)
  💬 *Conversation Starters:* Use /talk [topic] (e.g., /talk promotion discussion)
  💡 *Professional Responses:* Use /reply [situation] (e.g., /reply declining extra work)
  
  ⚡ Example Usage:
  /email meeting request
  /doc project report
  /talk team conflict
  /reply appreciation
  
  Enjoy using the bot! 🚀`;
    bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown" });
  });


// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   const query = msg.text.toLowerCase();

//   const found = chatData.find((entry) => entry.name.toLowerCase() === query);
//   const response = found ? `Name: ${found.name}, info: ${found.info}` : "Sorry, I couldn't find that person.";

//   bot.sendMessage(chatId, response);
// });

// 📧 Email Templates
bot.onText(/\/email (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[1]; // Get user input
  
  const emailTemplate = `
✉️ *Subject:* ${topic.charAt(0).toUpperCase() + topic.slice(1)} Request

Dear [Recipient's Name],

I hope this email finds you well. I am writing to discuss "${topic}". Please let me know a convenient time to talk or provide any details you may need.

Looking forward to your response.

Best Regards,  
[Your Name]
  `;

  bot.sendMessage(chatId, emailTemplate, { parse_mode: "Markdown" });
});

  
  // 📄 Document Templates
  const docs = {
    "meeting notes": "📄 *Meeting Notes*\n\n📅 Date: [Date]\n📝 Topic: [Meeting Topic]\n👥 Attendees: [Names]\n🗒️ Notes:\n- [Point 1]\n- [Point 2]\n\n✅ Next Steps:\n- [Task 1]\n- [Task 2]",
    "project report": "📊 *Project Report*\n\n📌 *Project Name:* [Project Name]\n📅 *Duration:* [Start Date] - [End Date]\n🔍 *Summary:* [Brief Description]\n✅ *Key Highlights:*\n- [Point 1]\n- [Point 2]"
  };
  
  bot.onText(/\/doc (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const docType = match[1].toLowerCase();
    bot.sendMessage(chatId, docs[docType] || "❌ Sorry, I don't have a template for that.", { parse_mode: "Markdown" });
  });
  
  // 💬 Conversation Starters
  const conversationStarters = {
    "performance feedback": "👋 Hey [Manager's Name], I wanted to get some feedback on my recent work. Could we have a quick discussion when you’re available?",
    "promotion discussion": "👋 Hi [Manager's Name], I’d like to talk about my growth in the company. Can we schedule a time to discuss my performance and next steps?",
    "team conflict": "👋 Hey [Manager's Name], I’d like to discuss some challenges I’m facing in the team. Can we talk sometime soon?"
  };
  
  bot.onText(/\/talk (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const topic = match[1].toLowerCase();
    bot.sendMessage(chatId, conversationStarters[topic] || "❌ Sorry, I don't have a conversation starter for that.");
  });
  
  // 💡 Professional Responses
  const responses = {
    "declining extra work": "Thanks for thinking of me! Right now, my workload is quite full, but I’d be happy to help later if needed.",
    "asking for help": "Hey [Colleague’s Name], I’m working on [Task] and could use some help. Do you have a few minutes to guide me?",
    "appreciation": "Thanks for your support! I really appreciate your help on this."
  };
  
  bot.onText(/\/reply (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const situation = match[1].toLowerCase();
    bot.sendMessage(chatId, responses[situation] || "❌ Sorry, I don't have a response for that.");
  });

  // 🍽️ Pakoda Recipe
const pakodaRecipe = `
🥣 *Crispy Pakoda Recipe by Vipul Yadav* 🥣

🛒 *Ingredients:*
- 1 cup *gram flour* (besan)
- 1/2 cup *chopped onions*
- 1 *green chili* (chopped)
- 1 tsp *cumin seeds* (jeera)
- 1/2 tsp *turmeric powder*
- 1/2 tsp *red chili powder*
- A pinch of *baking soda*
- Salt to taste
- Water as needed
- Oil for frying
- Coriander leaves (optional)

👨‍🍳 *Instructions:*
1. In a bowl, mix gram flour, onions, green chili, cumin, turmeric, red chili powder, and salt.
2. Add a little water and mix to form a thick batter.
3. Heat oil in a deep pan.
4. Drop small portions of the batter into the hot oil.
5. Fry until golden brown and crispy.
6. Remove and drain on paper towels.
7. Serve hot with chutney or tea! ☕

🔥 *Enjoy your homemade Pakodas!* 🔥
`;

// 📌 Command to Get Pakoda Recipe
bot.onText(/\/pakoda/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, pakodaRecipe, { parse_mode: "Markdown" });
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        const weather = response.data;

        const weatherMessage = `
🌍 *Weather in ${weather.name}, ${weather.sys.country}*  
🌡️ *Temperature:* ${weather.main.temp}°C  
🌬️ *Wind Speed:* ${weather.wind.speed} m/s  
💧 *Humidity:* ${weather.main.humidity}%  
☁️ *Condition:* ${weather.weather[0].description}  
        `;

        bot.sendMessage(chatId, weatherMessage, { parse_mode: "Markdown" });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, "❌ City not found! Please enter a valid city name.");
        } else if (error.response) {
            bot.sendMessage(chatId, "❌ OpenWeather API error. Try again later.");
        } else {
            bot.sendMessage(chatId, "❌ Unable to fetch weather. Please check your internet connection.");
        }
    }
});



console.log("Telegram bot is running...");
