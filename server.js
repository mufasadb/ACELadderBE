const express = require('express');
const bodyParser = require('body-parser')
const port = 3000
const users = require('./api/v1/characters')
const cors = require('cors')
const User = require("./api/v1/accounts");
const RegularJob = require("./regularJob");

RegularJob.start()



const app = express();
app.use(cors())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'ACE Ladder' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.use('/api/v1/users', users);

app.get("/accounts/", (request, response) => {

    User.members().then((data) => {
        response.json(data)
    })

});

app.use("/accounts/update", (req, res) => {
    console.log("tried to update accounts");
    User.updateMembers()
})


app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get(`env`) === `development` ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get(`env`) === `development` ? err : {}
    })
})



module.exports = app