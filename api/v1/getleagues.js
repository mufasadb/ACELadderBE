let originalLeagues = ["Standard", "SSF Standard", "Hardcore", "SSF Hardcore"]
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
                // console.log(chunks);
            });

            resp.on("end", () => {
                const leagues = JSON.parse(chunks.join(""));
                // console.log(leagues)
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

req2.end()