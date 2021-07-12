const https = require("https");
const User = require("../api/v1/accounts")
const Queries = require("../db/queries")
const minutesToReload = 5
const League = require("./leagues")


let tooManyReturned = false



async function getListOfCharacters() {
    let characters = []
    let users = await User.members()

    users.shift()
    for (user of users) {

        let currentChars = await Queries.getCharactersByUserID(user.id)
        // console.log(currentChars);
        for (character of currentChars) {
            character.accountName = user.accountName
        }
        console.log("returning DB chars")

    }
    characters = characters.flat();
    console.log(characters)
    return characters
    // return await Promise.all(characters).then((res) => {
    //     res = res.flat()
    //     setTimeout(() => { tooManyReturned = false }, 3000)
    //     console.log(res);
    //     return res
    // let sc = res.filter(obj => { return obj.hc === false })
    // let hc = res.filter(obj => { return obj.hc === true })

    // console.log(sc.length);
    // console.log(hc.length);
    // for (acc of res) {
    //     sc = sc.concat(acc.sc)
    //     hc = hc.concat(acc.hc)
    // }

    // sc.sort((a, b) => b.experience - a.experience);
    // hc.sort((a, b) => b.experience - a.experience);
    // if (hc.length > 0) {

    //     for (let i = 0; i < hc.length; i++) {
    //         hc[i].position = i + 1
    //     }
    // }
    // if (sc.length > 0) {
    //     for (let i = 0; i < sc.length; i++) {
    //         sc[i].position = i + 1
    //     }
    // }



    // return sc.concat(hc)
}




async function getSpecificCharacter(id) {
    let user = await Queries.getOneGeneric("accounts", id)
    let currentChars = await Queries.getCharactersByUserID(user.id)

    if (user.lastFetched < new Date(Date.now() - 1000 * 60 * minutesToReload)) {
        return getCharactersByUser(user, currentChars)
    } else {
        console.log("returning DB chars")
        return currentChars
    }
}

function getCharactersByUser(user, currentChars) {
    let chars = getUsersFromSite(user.accountName);
    saveChars(user.id, chars, currentChars)

    return chars
}

async function saveChars(userId, loadingChars, currentChars) {
    loadingChars.then((chars) => {
        let existedChars = 0;
        let brandSpankers = 0;
        console.log("there is ")
        console.log(chars.length)
        for (character of chars) {
            let submitable = {
                name: character.name,
                accountId: userId,
                lastChecked: new Date(),
                level: character.level,
                experience: character.experience,
                league: character.league,
                class: character.classId,
                ascendancy: character.class,

            }
            console.log(character.name)
            let existingCharsSearch = currentChars.filter((obj) => { return obj.name === character.name })
            if (existingCharsSearch.length === 0) {
                character.accountId = userId
                Queries.createGeneric("characters", submitable).then(d => { })
                brandSpankers++
            }
            if (existingCharsSearch.length === 1) {
                existedChars++
                try { Queries.updateGeneric("characters", existingCharsSearch[0].id, submitable).then(d => { }) }
                catch{ e => { throw e } }
            }
        }
        console.log(`${existedChars} Characters Updated and ${brandSpankers} brand spankers`)
        Queries.getOneGeneric("accounts", userId).then(
            (user) => {
                console.log(`setting ${user.accountName}'s last fetched to now`)
                user.lastFetched = new Date();;
                try {
                    Queries.updateGeneric("accounts", userId, user).then(data => { })
                }
                catch{
                    (e) => { throw e }
                }
            })
        return chars
    })
}

function getUsersFromSite(username) {
    try {
        return new Promise((resolve, reject) => {
            if (!tooManyReturned) {
                let returnableChars = []
                try {


                    req = https.request(
                        {
                            hostname: "www.pathofexile.com",
                            path: `/character-window/get-characters?accountName=${username}`,
                            method: "GET",
                        },
                        (resp) => {
                            if (resp.statusCode == 429) {
                                tooManyReturned = true
                            }
                            if (resp.statusCode == 200) {
                                let chunks = [];

                                resp.on("data", d => {
                                    chunks.push(d);
                                });

                                resp.on("end", () => {
                                    const characters = JSON.parse(chunks.join(""));
                                    for (char of characters) {
                                        if (League.currentLeagues.includes(char.league)) {
                                            char.account = username
                                            if (char.league.includes("Hardcore") || char.league.includes("HC")) { char.hc = true }
                                            returnableChars.push(char)
                                        }
                                    }
                                    resolve(returnableChars);
                                });
                            } else {
                                console.log(`Couldn't read characters: ${resp.statusCode} ${resp.statusMessage}`);
                                if (resp.statusCode == 429) { tooManyReturned = true }
                                reject(resp.statusCode);
                            }
                        }
                    ).on("error", (e) => {
                        console.error(e);
                        reject(e);
                    });
                    req.end();
                }
                catch{
                    reject(429)
                }
            }
        })
    }
    catch{ return  }
}




module.exports = {
    getListOfCharacters: () => { return getListOfCharacters() },
    getSpecificCharacter: (id) => { return getSpecificCharacter(id) }
}