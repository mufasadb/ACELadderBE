const puppeteer = require("puppeteer");
// const express = require("express");
// const router = express.Router();
const queries = require("../../db/queries")

let browser, page;

async function pupLauncher() {
    try {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
        );
        try {
            await page.goto(`https://www.pathofexile.com/guild/profile/913`);
        } catch (e) {
            throw e;
        }
    } catch (error) {
        console.log(error);
        console.log("Browser closed");
    }
}


async function updateMembers() {
    let currentMemberList = getMembersFromSite();
    let dbListOfMembers = queries.getAllGeneric("accounts");
    await Promise.all([currentMemberList, dbListOfMembers]).then((accs) => {
        let newAccs = 0;
        let oldAccs = 0;
        for (acc of accs[0]) {
            let found = accs[1].filter((obj) => { return obj.accountName === acc.accountName })
            if (found.length === 1) {
                if (!found[0].isActive) {
                    found[0].isActive = true
                    found[0].updatedAt = new Date(Date.now())
                    queries.updateGeneric("accounts", found[0].id, found[0])
                }
                else { }
            }
            else {
                console.log("trying to create account for")
                // console.log(acc);
                try { queries.createGeneric("accounts", acc).then(()=>{}) } catch{ e => { console.log(e) } };
            }
        }
        for (acc of accs[1]) {
            if (acc.isActive) {
                let found = accs[0].filter(obj => { return obj.accountName === acc.accountName })
                if (found.length === 0) {
                    //update is active to false
                    acc.isActive = false
                    acc.updatedAt = new Date(Date.now())

                    queries.updateGeneric("accounts", acc.id, acc)
                }
            }
        }

        console.log(`added ${newAccs}`)
        console.log(`removed ${oldAccs}`)
        return { newAccounts: newAccs, oldAccounts: oldAccs }
    })
}


async function getMembersFromSite() {
    if (!page) {
        await pupLauncher();
    }
    await page.waitForSelector("#guildProfile > div.profile-details > div.details-inner > div > div.members > div:nth-child(2)");
    const selectorData = await page.evaluate(() => {
        return document.querySelector("#guildProfile > div.profile-details > div.details-inner > div > div.members").innerText
    })
    let rawList = selectorData.split("\n")
    let members = []
    let position = "Member"
    let member = ""
    for (let i = 0; i < rawList.length; i++) {
        if (i === 0) { position = rawList[i] }
        else {
            if (i % 2 == 0) {
                position = rawList[i]
            } else {
                member = rawList[i]
                members.push({ accountName: member, position: position })
            }
        }
    }
    return members

}

// updateMembers();
async function checkAndWriteMembers(members) {

}

function getMembersFromDb() {
    return queries.getAllGeneric("accounts")
}


module.exports = {
    members: async function () {
        return await getMembersFromDb();

    },
    updateMembers: async function () {
        return updateMembers();
    }
}

