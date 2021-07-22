
const https = require("https");
const express = require("express");
const router = express.Router();
const User = require("./accounts")
const Queries = require("../../db/queries")
const CharacterHelp = require("../../helpers/character")





router.get("/", (req, res) => {
    let top = parseInt(req.headers.top)
    let leagueList = req.headers.leaguelist;
    let classList = req.headers.classlist
    CharacterHelp.getListOfCharacters(leagueList, top, classList).then((users) => {
        res.json(users);
    });

});
router.get("/ladder", (req, res) => {
    CharacterHelp.getLadderCharacters().then((users) => {
        res.json(users)
    })
})

router.get("/byUser/:id", (req, res) => {
    CharacterHelp.getSpecificCharacter(req.params.id).then(users => {
        res.json(users)
    })
})





module.exports = router;
