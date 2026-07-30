require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/sonbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/sonbot-frog", async ({ ack, respond }) => {
  await ack()
  const frogs = [
     { name: "Poison Dart Frog", fact: "Venomous and brightly colored to warn predators — some species can kill with just a touch." },
     { name: "Glass Frog", fact: "Has translucent skin on its belly — you can actually see its heart and organs." },
     { name: "Goliath Frog", fact: "The largest frog species alive, able to weigh up to 3.3kg (7.3 lbs)." },
     { name: "Wood Frog", fact: "Can freeze solid during winter and thaw back to life in spring." },
     { name: "Tomato Frog", fact: "Puffs up and secretes a sticky, irritating substance when threatened, named for its bright red-orange color." },
     { name: "Red-Eyed Tree Frog", fact: "Its bright red eyes are thought to startle predators for a split second, giving it time to escape." },
     { name: "Surinam Toad", fact: "Females carry their eggs embedded in pockets on their back until fully developed froglets emerge." },
     { name: "African Bullfrog", fact: "Males aggressively guard their tadpoles and will even dig channels to keep their pond from drying out." },
     { name: "Titicaca Water Frog", fact: "One of the most toxic animals on Earth — enough venom to kill about 10 grown men." },
     { name: "Golden Poison Frog", fact: "Has excessive folds of loose skin to absorb more oxygen underwater, since it rarely surfaces to breathe." },
     { name: "Pac-Man Frog", fact: "Named for its enormous mouth, it will try to eat almost anything that moves near it, including prey its own size." },
     { name: "Vietnamese Mossy Frog", fact: "Its bumpy, mottled skin makes it look almost exactly like a patch of moss." },
     { name: "Turtle Frog", fact: "Looks and burrows like a tiny turtle, using its short limbs to dig backward into sand." },
     { name: "Desert Rain Frog", fact: "Squeaks like a squeeze toy when startled and can't hop — it can only walk." },
     { name: "Amazon Milk Frog", fact: "Secretes a milky-white toxin from its skin when stressed or threatened." },
     { name: "Corroboree Frog", fact: "One of the few frogs that produces its own toxins rather than absorbing them from its diet." },
     { name: "Wallace's Flying Frog", fact: "Has huge webbed feet that act like parachutes, letting it glide between trees." } ,
     { name: "Hairy Frog", fact: "Males grow hair-like skin structures for extra oxygen absorption, and can break their own toe bones to produce claws for defense." },
     { name: "Paradoxical Frog", fact: "Its tadpole can grow up to 27cm long — much bigger than the adult frog it becomes." },
     { name: "Budgett's Frog", fact: "Nicknamed the 'Freddy Krueger frog' for the claw-like structures it uses to defend itself." },
     { name: "Malayan Horned Frog", fact: "Has pointed skin flaps above its eyes that mimic dead leaves for camouflage." },
     { name: "Purple Frog", fact: "Spends nearly its entire life underground and only surfaces for a couple of weeks a year to breed." },
     { name: "Lemur Leaf Frog", fact: "Changes color from green in the day to brown at night for better camouflage depending on activity." },
     { name: "Cane Toad", fact: "Originally introduced to control pests, it became a highly invasive species due to its toxic skin and rapid breeding." },
     { name: "Darwin's Frog", fact: "Males carry developing tadpoles inside their vocal sac until they're ready to hop out as tiny froglets." }
  ];
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  const frog = randomChoice(frogs);
  await respond({ text: `*🐸 ${frog.name}*\n${frog.fact}` });
});

app.command("/sonbot-hi", async ({ ack, respond }) => {
  await ack()
  await respond({ text: `Hi! I'm SonBot, I'm a bot made for Slack. Type /sonbot- to see all my commands.` });
});

app.command("/sonbot-bitcoin", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await fetch(`https://rest.coincap.io/v3/assets/bitcoin?apiKey=${process.env.COINCAP_API_KEY}`);
    const data = await res.json();
    const price = parseFloat(data.data.priceUsd);
    const change = parseFloat(data.data.changePercent24Hr);
    const arrow = change >= 0 ? "📈" : "📉";
    
    await respond({
      text: `₿ *Bitcoin Price*\n$${price.toLocaleString(undefined, { maximumFractionDigits: 2})} USD\n${arrow} ${change.toFixed(2)}% (24h)`
    });
  } catch (error) {
    console.error(error);
    await respond({ text: "Couldn't fetch the Bitcoin price right now, try again later. "});
  }
});

app.command("/sonbot-country", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await fetch("https://api.restcountries.com/countries/v5?limit=100", {
      headers: {
        Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`
      }
    });
    const data = await res.json();

    if (data.errors) {
      console.error("API error:", data.errors);
      await respond({ text: "Couldn't fetch a country right now, try again in a bit." });
      return;
    }

    console.log(JSON.stringify(data).slice(0, 500)); // TEMP - confirm shape

    const countries = data.data.objects;
    const country = countries[Math.floor(Math.random() * countries.length)];

    const name = country.names?.common ?? "Unknown";
    const capital = country.capital ?? "No capital listed";
    const region = country.region ?? "Unknown";
    const population = country.population?.toLocaleString() ?? "Unknown";

    await respond({
      text: `🌍 *${name}*\nCapital: ${capital}\nRegion: ${region}\nPopulation: ${population}`
    });
  } catch (error) {
    console.error(error);
    await respond({ text: "Couldn't fetch a country right now, try again later" });
  }
});

app.command("/sonbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/sonbot-ping - Check bot latency
/sonbot-catfact - Get a cat 
/sonbot-bitcoin - Price of Bitcoin in real time
/sonbot-frog - Random frog and a fact about it
/sonbot-country - Random country/territory
/sonbot-joke - Get a joke
/sonbot-explain [topic] - Explain a topic briefly
/sonbot-hi - Says hi!
/sonbot-quake - Most recent earthquake
/sonbot-word - Random word and its meaning
/sonbot-iss - Current ISS position and who is aboard.`
  });
});

app.command("/sonbot-iss", async ({ ack, respond}) => {
  await ack();
  try {
    const [posRes, astroRes] = await Promise.all([
      fetch("http://api.open-notify.org/iss-now.json"),
      fetch("http://api.open-notify.org/astros.json")
    ]);

    if (!posRes.ok || !astroRes.ok) {
      if (posRes.status === 429 || astroData.Res.status === 429) {
        await respond({ text: `ISS API rate limit hit, try again later`});
        return;
      }
      throw new Error(`ISS API returned non-ok status: pos=${posRes.status}, astro=${astroRes.status}`);
    }

    const posData = await posRes.json();
    const astroData = await astroRes.json();

    const lat = parseFloat(posData.iss_position.latitude).toFixed(2);
    const lon = parseFloat(posData.iss_position.longitude).toFixed(2);
    const issCrew = astroData.people.filter(p => p.craft === "ISS");
    const crewNames = issCrew.map(p => p.name).join(", ");

    await respond({
      text: `*ISS Current Position*\nLat: ${lat}, Lon: ${lon}\n\n*${issCrew.length} astronauts aboard:*\n${crewNames}`
    });
  } catch (error) {
    console.error("Error fetching ISS data:", error);
    await respond({ text: "Couldn't fetch ISS data right now, try again later"});
  }
});

app.command("/sonbot-quake", async ({ ack, respond }) => {
  
  const t0 = Date.now();
  await ack();
  console.log(`ack took ${Date.now() - t0}ms`);

  try {
    const t1 = Date.now();
    const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson");
    const data = await res.json();
    console.log(`fetch+parse took ${Date.now() - t1}ms`);

    if (!data.features || data.features.length === 0) {
      await respond({ text: "No significant earthquakes recorded in the last 24 hours."})
      return;
    }
    
    const quake = data.features[0];
    const mag = quake.properties.mag;
    const place = quake.properties.place;
    const time = new Date(quake.properties.time).toUTCString();
    const url = quake.properties.url;

    const t2 = Date.now();

    await respond({
      text: `*Latest Earthquake*\nMagnitude: ${mag}\nLocation: ${place}\nTime: ${time}\n<${url}|View on USGS>`
    });
    console.log(`respond took ${Date.now() - 2}ms`);
    console.log(`TOTAL: ${Date.now() - t0}ms`);
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    await respond({ text: "Couldn't fetch earthquake data right now, try again later"});
  }
});

app.command("/sonbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/sonbot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
}); 

app.command("/sonbot-explain", async ({ command, ack, respond}) => {
  await ack();
  const topic = command.text.trim();

  if (!topic) {
    await respond({
     response_type: "ephemeral",
     text: "Give me a topic to explain, e.g `/sonbot-explain photosynthesis`"
    });
    return;
  }

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "sonbot-slack-app" }
    });

    if (response.status == 404) {
      await respond({
        reponse_type: "ephemeral",
        text: `Couldn't find anything on "${topic}". Try being more specific or check spelling.`
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`Wikipedia API returned ${response.status}`);
    }
    const data = await response.json();
    if (data.type === `disambiguation`) {
      await respond({
        response_type: `ephemeral`,
        text: ` "${topic}" could mean several things, try a more specific term.`
      });
      return;
    }
    const sentences = data.extract.split(". ");
    const shortExplanation = sentences.slice(0, 2).join(". ") + (sentences.length > 1 ? "." : "");
    const link = data.content_urls?.desktop?.page;

    await respond({
      response_type: "in_channel",
      text: `*${data.title}*\n${shortExplanation}${link ? `\n<${link}|Read more>` : ""}`
    });
  } catch(error) {
    console.error("Error fetching explanation", error);
    await respond({
      response_type: "ephemeral",
      text: "Sorry, something went wrong fetching that explanation. Try again."
    });
  }
});

const fs = require("fs").promises;
const path = require("path");
const FEEDBACK_FILE = path.join(__dirname, "feedback.json");

app.command("/sonbot-feedback", async ({ command, ack, respond}) => {
  await ack();
  const feedbackText = command.text.trim();
  if (!feedbackText) {
    await respond({
      response_type: "ephemeral",
      text: "Please include your feedback after the command, e.g. `/sonbot-feedback The bitcoin command is slow`"
    });
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    userId: command.user_id,
    userName: command.user_name,
    channelId: command.channel_id,
    feedback: feedbackText
  };

  try {
    let feedbackList = [];
    try {
      const existing = await fs.readFile(FEEDBACK_FILE, "utf8");
      if (existing.trim()) {
        feedbackList = JSON.parse(existing);
      }
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
      }
      feedbackList.push(entry);
      await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbackList, null, 2));
      await respond({
        response_type: "ephemeral",
        text: `Thanks! Your feedback has been saved:\n> ${feedbackText}`
      });
    } catch (error) {
      console.error("Error saving feedback", error);
      await respond({
        response_type: "ephemeral",
        text: "Sorry, something went wrong saving your feedback."
      });
  }
});

app.command("/sonbot-word", async ({ ack, respond}) => {
  await ack();

  const words = [
    "serendipity", "grandiose", "ephemeral", "luminous", "quixotic", "labyrinth",
    "mellifluous", "petrichor", "wanderlust", "solitude", "nostalgia",
    "cascade", "whimsical", "resilience", "eloquent", "paradox",
    "tranquil", "enigma", "vivid", "juxtapose", "ethereal"
  ];

  const word = words[Math.floor(Math.random() * words.length)];

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!res.ok) {
      throw new Error(`Dictionary API returned ${res.status}`);
    }

    const data = await res.json();
    const meaning = data[0].meanings[0];
    const partOfSpeech = meaning.partOfSpeech;
    const definition = meaning.definitions[0].definition;
    const example = meaning.definitions[0].example;

    await respond({
      text: `*${word}* _(${partOfSpeech})_\n${definition}${example ? `\n_e.g. "${example}"_` : ""}`
    });
  } catch (error) {
    console.error("Error fetching word definition:", error);
    await respond({ text: `Couldn't fetch the definition for "${word}" right now, try again later.`})
  }
});

(async () => {
  try {
    await app.start();
    console.log("bot is running!");
  } catch (error) {
    console.error("Failed to start", error);
  }
})();   