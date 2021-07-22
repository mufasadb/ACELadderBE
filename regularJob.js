const Queries = require("./db/queries")
const CharacterHelp = require("./helpers/character")

const minutes = 3
const timeout = 1000 * 60 * minutes





function getUserData(user) {
    //actually update users info
    CharacterHelp.getSpecificCharacter(user.id)
}


async function kickOffJobs() {
    console.log("kicking off the Check Accounts Job")
    const users = await Queries.getAllGeneric("accounts")
    const listOfJobs = []
    for (let userIndex in users) {

        setTimeout(() => { getUserData(users[userIndex]); }, timeout / (users.length + 1) * userIndex)
    }
}


// setTimeout(() => {
//     kickOffJobs()
// }, timeout)
// kickOffJobs()
function jobLoop() {
    setTimeout(() => {
        kickOffJobs()
        jobLoop()
    }, timeout)
}

module.exports = {
    start: () => { kickOffJobs();jobLoop() }
}

