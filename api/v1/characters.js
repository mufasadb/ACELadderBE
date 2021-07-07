
const https = require("https");
const express = require("express");
const router = express.Router();



let users = ["freney", "dtmhawk"]



async function getListOfCharacters() {
    let characters = []
    for (user of users) {
        characters.push(getCharactersByUser(user))
    }
    return await Promise.all(characters).then((res) => {
        sc = []
        hc = []
        for (acc of res) {
            sc = sc.concat(acc.sc)
            hc = hc.concat(acc.hc)
        }

        sc.sort((a, b) => b.experience - a.experience);
        hc.sort((a, b) => b.experience - a.experience);


        for (let i = 0; i < hc.length; i++) {
            hc[i].position = i + 1
        }
        for (let i = 0; i < sc.length ; i++) {
            sc[i].position = i + 1
        }



        return sc.concat(hc)
    })
}


router.get("/", (req, res) => {
    getListOfCharacters().then((users) => {
        res.json(users);
    });
});

function getCharactersByUser(username) {
    return new Promise((resolve, reject) => {
        let returnableChars = { sc: [], hc: [] }

        req = https.request(
            {
                hostname: "www.pathofexile.com",
                path: `/character-window/get-characters?accountName=${username}`,
                method: "GET",
            },
            (resp) => {

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
                                if (char.league.includes("Hardcore") || char.league.includes("HC")) { char.hc = true; returnableChars.hc.push(char) }
                                else { returnableChars.sc.push(char) }
                            }
                        }
                        resolve(returnableChars);
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
