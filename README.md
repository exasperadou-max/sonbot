# SonBot 🐸
 
A Slack bot built with Node.js. Deployed 24/7 on [Nest](https://nest.hackclub.com/) 
 
## Commands
 
| Command | Description |
|---|---|
| `/sonbot-ping` | Checks bot latency |
| `/sonbot-hi` | Says hi and lists what SonBot does |
| `/sonbot-help` | Lists all available commands |
| `/sonbot-frog` | Random frog species + a fact about it |
| `/sonbot-catfact` | Random cat fact ([catfact.ninja](https://catfact.ninja/)) |
| `/sonbot-joke` | Random joke ([official-joke-api](https://official-joke-api.appspot.com/)) |
| `/sonbot-word` | Random word + definition ([dictionaryapi.dev](https://dictionaryapi.dev/)) |
| `/sonbot-explain [topic]` | Short, simplified explanation of any topic (Wikipedia summary API) |
| `/sonbot-bitcoin` | Live Bitcoin price + 24h change ([CoinCap](https://coincap.io/)) |
| `/sonbot-country` | Random country's capital, region, and population ([REST Countries](https://restcountries.com/)) |
| `/sonbot-iss` | Current ISS position + astronauts aboard ([Open Notify](http://open-notify.org/)) |
| `/sonbot-quake` | Most recent significant earthquake worldwide ([USGS](https://earthquake.usgs.gov/)) |
| `/sonbot-feedback [text]` | Saves bug reports / improvement suggestions to a local file |
 
## Tech Stack
 
- **Node.js**
- **axios** for some HTTP requests, native `fetch` for others
- Plain JSON file storage for feedback

 
## Notes
 
- All external APIs used are free-tier / no-cost.
- `feedback.json` is gitignored and stores locally submitted bug reports/suggestions.
