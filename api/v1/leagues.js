
const express = require("express");
const router = express.Router();
const ConfigHelper = require("../../helpers/config");
const leagues = ConfigHelper.config.leagueList
const LeagueHelper = require("../../helpers/getleagues")




router.get("/", (req, res) => {
    console.log("the leagues are")
    console.log(leagues)
    res.json(leagues);
});

router.get("/current", (req, res) => {
    LeagueHelper.leagueList().then((currentLeagues) => {
        res.json(currentLeagues)
    });
})




module.exports = router;
