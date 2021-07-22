let originalLeagues = ["Standard", "SSF Standard", "Hardcore", "SSF Hardcore"]
const https = require("https");

let currentLeagues = []
const req2 = https.request(
    {
        hostname: "www.pathofexile.com",
        path: `/api/leagues`,
        method: "GET",
    },
    (resp) => {
        // console.log(`\n${username}:`);

        if (resp.statusCode == 200) {
            let chunks = [];

            resp.on("data", d => {
                chunks.push(d);
            });

            resp.on("end", () => {
                const leagues = JSON.parse(chunks.join(""));
                leagues.map(league => {
                    if (!originalLeagues.includes(league.id)) {
                        console.log(league.id)
                    }
                })
            });
        } else {
            console.log(`Couldn't read characters: ${resp.statusCode} ${resp.statusMessage}`);
        }
    }
).on("error", (e) => {
    console.error(e);
});

// req2.end()

module.exports = {
    leagueList: async () => {
        req2.end();
        console.log(currentLeagues)
        return currentLeagues
    }
}