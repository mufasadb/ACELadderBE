const Queries = require("./db/queries")
const CharacterHelp = require("./helpers/character")

const minutes = 5
const timeout = 1000 * 60 * minutes





function getUserData(user) {
    //actually update users info
    CharacterHelp.getSpecificCharacter(user.id)
}


async function kickOffJobs() {
    const users = await Queries.getAllGeneric("accounts")
    const listOfJobs = []
    for (let userIndex in users) {

        setTimeout(() => { getUserData(users[userIndex]); console.log(users[userIndex].accountName) }, timeout / users.length / 2 * userIndex)
    }
}


// setTimeout(() => {
//     kickOffJobs()
// }, timeout)
kickOffJobs()
function jobLoop() {
    setTimeout(() => {
        kickOffJobs()
        jobLoop()
    }, timeout)
}

module.exports = {
    start: () => { jobLoop() }
}

