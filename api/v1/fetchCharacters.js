
const https = require("https");




let users = ["freney", "dtmhawk"]

for (user of users) {
    getCharactersByUser(user)
}

function getCharactersByUser(username) {
    console.log(username);
    req = https.request(
        {
            hostname: "www.pathofexile.com",
            path: `/character-window/get-characters?accountName=${username}`,
            method: "GET",
        },
        (resp) => {
            console.log(`\n${username}:`);

            if (resp.statusCode == 200) {
                let chunks = [];

                resp.on("data", d => {
                    chunks.push(d);
                    // console.log(chunks);
                });

                resp.on("end", () => {
                    const characters = JSON.parse(chunks.join(""));
                    for (char of characters) {
                        if (leagues.includes(char.league)) {
                            let words = "but it barely counts"
                            if (char.league.includes("Hardcore")||char.league.includes("HC")) { words = "and he's metal AF" }
                            console.log(`${username}'s ${char.class},  ${char.name} made it to ${char.level} ${words}`)
                        }
                    }
                });
            } else {
                console.log(`Couldn't read characters: ${resp.statusCode} ${resp.statusMessage}`);
            }
        }
    ).on("error", (e) => {
        console.error(e);
    });
    req.end();
}


let leagues = ["Ultimatum",
    "Hardcore Ultimatum",
    "SSF Ultimatum",
    "SSF Ultimatum HC"]


