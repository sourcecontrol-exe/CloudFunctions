const db = require("./../index.js").db;
const UnitTestData = require("./UnitTest.js")

// set this to TRUE for testing
let isMockTestData = false;

// may not be required to reset..
module.exports.init = function() {
    tourneyCache = {}
    userCache = {}
    tourneyGroupCache = {}
}

module.exports.getSignupsForTourney = function(tourneyId) {
    if (isMockTestData) {
        return Promise.resolve(UnitTestData.getStubSignups());
    }
    return db.collection('TourneyScore')
        .where("LeagueId", "==", "")
        .where("TourneyId", "==", tourneyId)
        .limit(3000)
        .get().then(snapshot => {
            let signups = [];
            if (!snapshot.empty) {
                snapshot.forEach(item => {
                    signups.push(item.data());
                });
            }
            return signups;
        });
}


module.exports.getActiveTourney = function() {
    if (isMockTestData) {
        return Promise.resolve(UnitTestData.getStubActiveTourney());
    }
    let currentTime = new Date().toISOString();
    console.log("Querying active tourneys: " + currentTime);

    return db.collection("TourneyInfo")
        .where("TourneyEnd", ">", currentTime)
        .orderBy("TourneyEnd")
        .limit(3)
        .get().then(snapshot => {
            let tourneyIds = [];
            if (!snapshot.empty) {
                snapshot.forEach(item => {
                    let tourney = item.data();
                    console.log(" Tourney = " + JSON.stringify(tourney));

                    if (tourney.TourneyStart < currentTime && currentTime < tourney.TourneyEnd) {
                        console.log("----Active Tourney ----");
                        tourneyCache[tourney.TourneyId] = tourney;
                        tourneyIds.push(tourney.TourneyId);
                    }
                });
            } else {
                console.log("---No active tournaments running--");
            }
            return tourneyIds;
        });
}

let tourneyCache = {}
module.exports.getTourneyFromId = function(id) {
    //console.log(JSON.stringify(tourneyCache));
    if (id in tourneyCache) {
        // console.log("--- Getting Tournament from cache---");
        return Promise.resolve(tourneyCache[id]);
    }
    return db.collection("TourneyInfo").doc(id).get().then(snapshot => {
        console.log("Reading Tournament from db: " + id);
        tourneyCache[id] = snapshot.data();
        return Promise.resolve(tourneyCache[id]);
    })
}

var userCache = {};
module.exports.getUserFromId = function(id) {
    if (id in userCache) {
        // console.log("--- Getting UserId from cache---");
        return Promise.resolve(userCache[id]);
    }

    // Cache here if applicable
    return db.collection("PublicUserData").doc(id).get().then(snapshot => {
        console.log("Reading UserData from db");
        userCache[id] = snapshot.data();
        return Promise.resolve(userCache[id]);
    })
}

var tourneyGroupCache = {};
var getLeagueNumber = module.exports.getLeagueNumber = function(tournament, groupId) {
    let MAX_SIZE = Number(25);
    if (tournament.LeagueSize) {
        MAX_SIZE = Number(tournament.LeagueSize);
    }
    let tourneyId = tournament.TourneyId;

    if (tourneyId in tourneyGroupCache) {
        let groupDic = tourneyGroupCache[tourneyId];
        if (groupId in groupDic) {
            let participants = groupDic[groupId].Participants;
            if (participants < MAX_SIZE) {
                groupDic[groupId].Participants++;
            } else {
                groupDic[groupId].Participants = 0;
                groupDic[groupId].MaxLeagueId++;
            }
            // console.log("--- Getting LeagueId from cache---");
            return Promise.resolve(groupDic[groupId].MaxLeagueId);
        }
    }

    console.log("--- Quering LeagueId from DB for " + tourneyId + " : " + groupId);
    return db.collection("TourneyScore")
        .where("TourneyId", "==", tourneyId)
        .where("GroupId", "==", groupId)
        .orderBy("LeagueNumber", "desc")
        .limit(MAX_SIZE + 1)
        .get()
        .then(snapshot => {
            let LeagueNumber = 1;
            let Participants = 0;
            if (!snapshot.empty) {
                var LeagueNumberArr = []
                snapshot.forEach(item => {
                    //console.log("Adding  " + JSON.stringify(item.data()));
                    LeagueNumberArr.push(item.data().LeagueNumber)
                })
                // console.log("@@@League Arr = " + LeagueNumberArr);
                LeagueNumber = Math.max(...LeagueNumberArr)
                for (var i = 0; i < LeagueNumberArr.length; ++i) {
                    if (LeagueNumberArr[i] == LeagueNumber)
                        Participants++;
                }
                console.log(LeagueNumber, "is max league Id assigned and", Participants, "is total number of times it occured")
            }

            tourneyGroupCache[tourneyId] = {};
            tourneyGroupCache[tourneyId][groupId] = {
                MaxLeagueId: LeagueNumber,
                Participants: Participants
            };
            return getLeagueNumber(tournament, groupId);
        })
}

module.exports.saveTourneyScore = function(tourneyId, userId, groupId, leagueNumber) {
    let docId = tourneyId + "|||||" + userId;
    return db.collection("TourneyScore").doc(docId).set({
        "LeagueNumber": leagueNumber,
        "GroupId": groupId,
        "LeagueId": groupId + "-" + leagueNumber.toString(),
        "LastUpdated": new Date().toISOString(),
    }, {
        merge: true
    });
}
