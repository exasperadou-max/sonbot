require("dotenv").config();

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

(async () => {
  try {
    await app.start();
    console.log("bot is running!");
  } catch (error) {
    console.error("Failed to start", error);
  }
})();   