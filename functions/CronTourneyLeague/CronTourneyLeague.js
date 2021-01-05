const functions = require('firebase-functions');

var getGroup = require("./Grouper.js");
var dbReader = require("./DbReader.js");

function getMaxLevel(tourneyScore) {
    if (tourneyScore.MaxLevel > 0) {
        return Promise.resolve(tourneyScore.MaxLevel);
    } else {
        return dbReader.getUserFromId(tourneyScore.UserId).then(publicUserData => {
            try {
                return Number(publicUserData.GameProgressData.MaxLevel)
            } catch (err) {
                console.error("Can't get maxlevel for user: " + JSON.stringify(publicUserData, null, 2));
                return Number(0);
            }
        });
    }
}

function processSignups(tourneyScore) {
    console.log("processing: " + JSON.stringify(tourneyScore));

    var tourneyId = tourneyScore.TourneyId;
    var userId = tourneyScore.UserId;
    return getMaxLevel(tourneyScore)
        .then(maxLevel => {
            let groupId = getGroup.getGroupId(maxLevel);
            console.log("Using max level = " + maxLevel, " groupId= " + groupId);

            return dbReader.getTourneyFromId(tourneyId).then(tourneyInfo => {
                //console.log("Tourney max size = " + tourneyInfo.LeagueSize);
                return dbReader.getLeagueNumber(tourneyInfo, groupId)
            }).then(leagueNumber => {
                console.log("===== Assigning LeagueNumber == " + leagueNumber);
                return dbReader.saveTourneyScore(tourneyId, userId, groupId, leagueNumber);
            });
        }).catch(err => {
            console.error("Exception processing: " + JSON.stringify(tourneyScore));
            return Promise.reject(err);
        });
}

function queryActiveTourney() {
    return dbReader.getActiveTourney().then(tourneyIdArr => {
        var promises = [];
        tourneyIdArr.forEach(tourneyId => {
            promises.push(processTourney(tourneyId));
        })
        return Promise.all(promises);
    });
}

function processTourney(tourneyId) {
    console.log("Processing TourneyId =" + tourneyId);
    return dbReader.getSignupsForTourney(tourneyId)
        .then(signupArr => {
            var p = Promise.resolve();
            signupArr.forEach(signupScore => {
                p = p.then(() => processSignups(signupScore));
            });
            return p;
        });
}


exports.CronTourneyLeague=functions.pubsub.schedule('every 2 minutes').onRun((context)=>{
    console.log('-------- CronTourneyLeague STARTED AT ', context.timestamp);
    dbReader.init();
    return queryActiveTourney();
});
