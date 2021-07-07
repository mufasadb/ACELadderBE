
const https = require("https");
const express = require("express");
const router = express.Router();



let users = ["freney", "dtmhawk"]



async function getListOfCharacters() {
    let characters = []
    for (user of users) {
        characters.push(getCharactersByUser(user))
    }
    console.log("trying")
    console.log(characters)
    return await Promise.all(characters).then((res) => {
        res = res.flat(2)

        res.map()
        return res
    })
}


router.get("/", (req, res) => {
    console.log("hit me")
    getListOfCharacters().then((users) => {
        res.json(users);
    });
});

function getCharactersByUser(username) {
    console.log(username);
    return new Promise((resolve, reject) => {
        let returnableChars = []

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
                                char.account = username
                                if (char.league.includes("Hardcore") || char.league.includes("HC")) { char.hc = true }

                            }
                        }
                        resolve(characters);
                    });
                } else {
                    console.log(`Couldn't read characters: ${resp.statusCode} ${resp.statusMessage}`);
                }
            }
        ).on("error", (e) => {
            console.error(e);
            reject(e);
        });
        req.end();
    })
}


let leagues = ["Ultimatum",
    "Hardcore Ultimatum",
    "SSF Ultimatum",
    "SSF Ultimatum HC"]


module.exports = router;
