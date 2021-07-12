
const https = require("https");
const express = require("express");
const router = express.Router();
const User = require("./accounts")
const Queries = require("../../db/queries")
const CharacterHelp = require("../../helpers/character")





router.get("/", (req, res) => {
    CharacterHelp.getListOfCharacters().then((users) => {
        res.json(users);
    });

});

router.get("/byUser/:id", (req, res) => {
    CharacterHelp.getSpecificCharacter(req.params.id).then(users => {
        res.json(users)
    })
})




// let leagueList = [ultimatum, ritual, deleeirum, gauntlet]

module.exports = router;
