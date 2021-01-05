const functions = require('firebase-functions');
const db = require("./../index.js").db;

const TOURNEY_DURATION = 1;


// get random number between 1 to n
function getRandom(n) {
    return Math.floor(Math.random() * n) + 1
}

function getRandomBool() {
    return getRandom(2) == 1;
}

function addDays(date, days) {
    var newDate = new Date();
    newDate.setTime(date.getTime() + days * 86400000);
    return newDate;
}

function addHours(date, hours) {
    var newDate = new Date();
    newDate.setTime(date.getTime() + hours * 3600000);
    return newDate;
}

function addMins(date, mins) {
    var newDate = new Date();
    newDate.setTime(date.getTime() + mins * 60000);
    return newDate;
}

function getStartDate(d) {
    d = new Date(d);
    d.setUTCHours(0, 0, 0, 0);
    return new Date(d);
}

var yearStart = new Date(2019, 1, 1);

function getTourneyId(startDate) {
    var numDay = Math.floor((startDate.getTime() - yearStart.getTime()) / (60 * 60 * 24 * 1000)).toString();
    return "#" + ("0000" + numDay).substring(numDay.length)
}

function getTournamentName(tourneyId) {
    // Rotate based on array index
    return "Alice";
}

function addTourneyPromise(expectedStartDate) {
    let startDate = getStartDate(expectedStartDate);
    // console.log("Expected: " + expectedStartDate.toISOString() + " , MyStartDate = " + startDate.toISOString());

    let endDate = addHours(startDate, TOURNEY_DURATION * 24);
    endDate.setTime(endDate.getTime() - 1);

    let tourneyId = getTourneyId(startDate);

    let rewards1 = JSON.parse('{"League":[{"Boosts":{"Magic":1,"Snake":1,"Trio":1},"Coin":250,"MinRankLimit":1,"MaxRankLimit":1},{"Boosts":{"Magic":1,"Snake":1},"Coin":250,"MinRankLimit":2,"MaxRankLimit":3},{"Boosts":{"Snake":1},"Coin":250,"MinRankLimit":4,"MaxRankLimit":5},{"Boosts":{"Magic":1},"Coin":250,"MinRankLimit":6,"MaxRankLimit":10},{"Coin":25,"MinRankLimit":11,"MaxRankLimit":25}]}');

    let rewards2 = JSON.parse('{"League":[{"Boosts":{"Bomb":1,"Fireball":1,"Trio":1},"Coin":250,"MinRankLimit":1,"MaxRankLimit":1},{"Boosts":{"Bomb":1,"Fireball":1},"Coin":250,"MinRankLimit":2,"MaxRankLimit":3},{"Boosts":{"Fireball":1},"Coin":250,"MinRankLimit":4,"MaxRankLimit":5},{"Boosts":{"Bomb":1},"Coin":250,"MinRankLimit":6,"MaxRankLimit":10},{"Coin":25,"MinRankLimit":11,"MaxRankLimit":25}]}');

    return db.collection("TourneyInfo").doc(tourneyId).set({
        "TourneyId": tourneyId,
        "TourneyName": getTournamentName(tourneyId),
        "TourneyStart": startDate.toISOString(),
        "TourneyEnd": endDate.toISOString(),
        "LeagueSize": 25,
        "TourneyRewards": getRandomBool() ? rewards1 : rewards2,
        "LastUpdated": new Date().toISOString()
    }, {
        merge: true
    }).then(() => {
        return "[" + tourneyId + "]: " + startDate.toISOString() + " - " + endDate.toISOString();
    })
}

var input = {
    StartDate: new Date("2020-08-28"),
    EndDate: new Date("2020-09-05")
};

//--------------------------------LOCAL Create TOURNEY on 31st february which will never happen-----------------
exports.CreateTourney=functions.pubsub.schedule('0 5 31 2 *').onRun((context)=>{
    console.log('-------- CreateTournament STARTED AT ', context.timestamp);
    var tourneyPromises = [];
    var start = input.StartDate;
    var nowDate = new Date();
    while (start < input.EndDate) {
        //console.log("Adding tourney");
        tourneyPromises.push(addTourneyPromise(start));
        start = addDays(start, TOURNEY_DURATION);
    }

    return Promise.all(tourneyPromises).then(function(res) {
        console.log("----OVER --- Tourney Created: " + JSON.stringify(res, null, 2));
    }).catch(function(err) {
        console.log("-- FAIL--" + JSON.stringify(err, null, 2));
        return Promise.reject(err);
    });
});
