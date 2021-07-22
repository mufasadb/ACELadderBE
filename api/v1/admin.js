
const https = require("https");
const express = require("express");
const router = express.Router();
const User = require("./accounts")
const Queries = require("../../db/queries")
const CharacterHelp = require("../../helpers/character")
const Config = require("../../helpers/config")




router.get("/", (req, res) => {
    res.json(Config.config)
});

router.post("/config/leagues", (req, res) => {
    if (req.body.leagues.length > 0) {
        Config.config.leagueList = req.body.leagues
        res.json(Config.config)
    } else {
        next(new Error("must be a list of strings seperated by commas"))
    }
})

router.post("/config/timeout", (req, res) => {
    if (req.body.timeout.typeof === "number" && req.body.timeout > 0) {
        Config.config.timeout = req.body.timeout
        res.json(Config.config)
    } else {
        next(new Error("time must be an integer and be larger than 0"))
    }

})

module.exports = router