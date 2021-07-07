const puppeteer = require("puppeteer");

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




pupLauncher();

async function getMembers() {
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
                members.push({ user: member, position: position })
            }
        }
    }
    console.log(members)

}


getMembers();