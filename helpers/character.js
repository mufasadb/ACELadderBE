const https = require("https");
const User = require("../api/v1/accounts")
const Queries = require("../db/queries")
const ConfigHelper = require("./config")
const Config = ConfigHelper.config
const League = Config.leagueList
const minutesToReload = Config.timeout
const levelCaps = require("./levelCaps");

let tooManyReturned = false

for (level of levelCaps.list) {
    level.xpToGain = level.xpToGain.replace(",", "").replace(",", "").replace(",", "")
    level.totalXP = level.totalXP.replace(",", "").replace(",", "").replace(",", "")
}





async function getListOfCharacters(leagueList, top, classList) {

    let characters = []
    let users = await User.members()

    users.shift()
    for (user of users) {

        let currentChars = await Queries.getCharactersByUserID(user.id)
        for (character of currentChars) {
            character.accountName = user.accountName

            if (character.league.includes("Hardcore" || character.league.includes("HC"))) {
                character.hc = true
            } else { character.hc = false }
        }
        characters.push(currentChars)

    }
    data = characters.flat()
    if (leagueList.length === 0) {
        data = data.filter(obj => { return (obj.league.includes("HC") || obj.league.includes("Hardcore")) })
    } else {
        leagueList = leagueList.split(",")
        console.log(leagueList)
        let newData = []
        for (char of data) {
            for (league of leagueList) {

                if (league == char.league) {
                    newData.push(char)
                }
            }
        }
        data = newData
    }
    if (classList.length > 0) {
        classList = classList.split(",");
        
        data = data.filter(obj => { return classList.includes(obj.ascendancy) })
    }
    data = sortAndPosition(data)
    if (top) {
        return (data.slice(0, top))
    }
    console.log(data);
    return data
}

function sortAndPosition(characterList) {
    characterList.sort((a, b) => b.experience - a.experience)
    for (i in characterList) {
        let val = 1
        val = val + parseInt(i)
        characterList[i].position = val;
        // console.log(characterList[i].level)
        let thisLevelDeets = levelCaps.list.filter(obj => { return obj.level == characterList[i].level.toString() })
        if (thisLevelDeets.length === 0) {
            console.log(characterList[i])
        } else {
            characterList[i].xpThisLevel = thisLevelDeets[0].totalXP
            // console.log(characterList[i].xpThisLevel)
            characterList[i].xpToNext = thisLevelDeets[0].xpToGain
        }

    }
    return characterList
}



async function getSpecificCharacter(id) {
    let user = await Queries.getOneGeneric("accounts", id)
    let currentChars = await Queries.getCharactersByUserID(user.id)

    if (user.lastFetched < new Date(Date.now() - 1000 * 60 * minutesToReload)) {
        return getCharactersByUser(user, currentChars)
    } else {
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
                isAlive: true

            }
            // console.log(character.name)
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
        for (oldCharacter of currentChars) {
            let foundCharacters = chars.filter(obj => { return obj.name == oldCharacter.name })
            if (foundCharacters == 0) {
                //find the dead guy
                oldCharacter.isAlive === false
                try { Queries.updateGeneric("characters", oldCharacter.id, oldCharacter).then(d => { }) }
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
                                        if (League.includes(char.league)) {
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
    catch{ return }
}




module.exports = {
    getListOfCharacters: (leagueList, top, classList) => { return getListOfCharacters(leagueList, top, classList) },
    getSpecificCharacter: (id) => { return getSpecificCharacter(id) }
}