var functions = require('firebase-functions');
var admin = require("firebase-admin");
process.env.GCLOUD_PROJECT = JSON.parse(process.env.FIREBASE_CONFIG).projectId




admin.initializeApp();

module.exports.db = admin.firestore();

// Cron to assign league id to tourney scores/signups-
exports.CronTourneyLeague = require("./CronTourneyLeague/CronTourneyLeague").CronTourneyLeague;
//--------------------------------LOCAL Create TOURNEY --------------------------
exports.CreateTourney = require("./Local/CreateTourney").CreateTourney;




const ClanOnWrite = require("./ClanOnWrite/ClanOnWrite");
const SearchKeywordsGeneration = require("./ClanSearch");
const TourneyCreation = require("./cronTourneyCreation");
const ClanMaintainer = require("./ClanMaintainer");
const RequestDeletion = require("./ClanRequestDeletion");
const LeagueAndGroupIdAssignment = require("./LeagueIdAssignment")
const cronStarsUpdate = require("./cronStarsUpdate");
const cronWeeklyHelpReset = require("./cronWeeklyHelpReset")
const ClanMaintainerNew = require('./ClanMaintainerNew')
const ClanRequestDeletionNew = require('./ClanRequestDeletionNew')
const MemberSync = require('./ClanMemberSync')

//const ClanBotsCreation = require("./ClanBotsCreator")
//const BotMaintainer=require("./BotMaintainer")
const TeamTourney = require("./TeamTourney")
//const TourneyCreationYear=require("./TourneyCreationYear")

//-------------------------------------------CronFunctions-----------------------------------------------------------------------------------------


// //------------------------------------------ClanStarsUpdate--(every 10 min)--------------------------------------------------------------------------------
exports.cronStarsUpdateClan = functions.pubsub.schedule('0-59/10 * * * *').onRun((context) => {
  cronStarsUpdate.handle(db);
})



// //-------------------------------------------------weekly help reset--------------------------------------------------------------------------
//-------------------------------------------------every week sunday at 00:00 hrs----------------------------------------------------------------
exports.cronHelpReset = functions.pubsub.schedule('0 0 * * 0').onRun((context) => {
  cronWeeklyHelpReset.handle(context, db);
})

//---------------------------------------------------------tourney Creation------------------------------
// exports.cronTourneyCreation = functions.pubsub.schedule('0 0 * * *').onRun((context)=>{
//   TourneyCreation.handle(context,db);
// })
exports.TourneyCreatorForYear = functions.firestore.document("testTourney/{documentId}").onCreate((snap) => {
  TourneyCreation.handle(db);
})


//------------------------------------updating clan with search keywords when it is formed----------------------------------------------------
exports.ClanSearchKeysGeneration = functions.firestore.document('Clans/{documentId}').onCreate((snapshot) => {
  SearchKeywordsGeneration.handle(snapshot, db);
})



exports.ClanOnWrite = functions.firestore.document("Clans/{clanId}").onWrite((change, context) => {
  return ClanOnWrite.handle(change, context);
})

//--------------------clan maintainer( maintaining leader,stars)---------------
exports.ClanMaintainer = functions.firestore.document("Clans/{documentId}").onUpdate((change) => {
  ClanMaintainer.handle(change, db);
})


// STARS update on member joining
exports.ClanMaintainerNew = functions.firestore.document("Clans/{documentId}").onUpdate((change) => {
  ClanMaintainerNew.handle(change, db);
})

exports.ClanMemberSync = functions.firestore.document("Clans/{documentId}").onUpdate((change) => {
  MemberSync.handle(change, db)
})

//----------------------------------------------ClanRequestDeletion---------------------------------------------------------------------
exports.ClanRequestDeletion = functions.firestore.document('Clans/{documentId}').onUpdate((change) => {
  RequestDeletion.handle(change, db);
})

exports.ClanRequestDeletionNew = functions.firestore.document('Clans/{documentId}').onUpdate((change) => {
  ClanRequestDeletionNew.handle(change, db);
})





//------------------------------------------------Bot Maintainer-----------------------------------------------------------------
exports.BotMaintainer = functions.firestore.document("ZestTrigger2/{documentId}").onCreate((snap) => {
  console.log("BotMaintainerInitiated");
  BotMaintainer.handle(db)
})

//-------------------------------------leagueId Asiignment on every SignUp--------------------------------------------------

//
exports.LeagueAndGroupIdAssignment = functions.firestore.document('TourneyScore/{documentId}').onCreate((snapshot) => {
  LeagueAndGroupIdAssignment.handle(snapshot, db);
})


//--------------------------will update TeamTourney Info On creation--------------------------------------------------------
exports.TeamTourney = functions.firestore.document('TeamChestInfo/{documentId}').onCreate((snapshot) => {
  TeamTourney.handle(snapshot, db);
})

