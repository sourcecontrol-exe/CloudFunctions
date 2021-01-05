/* eslint-disable promise/always-return */
const BotClanDonation= require('./BotClanDonation')
const BotClanDeletion=require('./BotClanDeletion')
const BotClanSmile=require('./BotClanSmile')
const BotLevelJump=require('./BotClanLevelJump')
var FieldValue = require("firebase-admin").firestore.FieldValue;
var name=[ "Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon",
"Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing",
"Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig",
"Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", 
"Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", 
"Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", 
"Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo",
"Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", 
"Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan",
"Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", 
"Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde",
"Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson",
"Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom",
 "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"]
var len=name.length
Math.floor(Math.random()*len-1)
function levelUpdate(increment,presentMaxLevel){
    let leveldata=[];
    let presentMaxLevelcopy=presentMaxLevel;
    for (i=0;i<increment;i++){
        presentMaxLevelcopy=presentMaxLevelcopy+1;
        let obj={
            "Level":presentMaxLevelcopy,
            "Score":3000,
            "Stars":3
        }
        leveldata.push(obj)
    }
    return leveldata;
}


function NumberOfLevel(BotType){
    if(BotType==="Active"){
        return(Math.floor(Math.random()*21)+40);
        }
    else if(BotType==="InActive"){
        return(Math.floor(Math.random()*11)+30);
        }
    else if(BotType==="Fodder"){
        return(Math.floor(Math.random()*6)+40);
        }
    else if(BotType==="Sporadic"){
        return(Math.floor(Math.random()*6)+31);
        }
}



/* eslint-disable promise/catch-or-return */
function BotClanJoin(db){  
    return new Promise((resolve,reject)=>{
        console.log("ClanJoin")
        let date=new Date().toISOString()
        db.collection("ClanBots").where("ClanJoinTime","<=",date).get()
        .then(snapshot=>{
            // eslint-disable-next-line promise/always-return
            if(snapshot.empty ){
                console.log("No bots with recent Joining date")
                return
            }
            snapshot.forEach(element=>{
                //console.log(element.data().Status)
                if(element.data().Status==="NotDeployed"){
                    // eslint-disable-next-line consistent-return
                    let levels=NumberOfLevel(element.data().BotType)    
                    console.log("levels",levels)
                    let nameIndex=Math.floor(Math.random()*len-1)
                    let BotName=name[nameIndex]
                    let LevelDataArray=levelUpdate(levels,0)
                console.log(element.data().ClanId,element.id,BotName)
                // eslint-disable-next-line promise/no-nesting
                db.collection("PublicUserData").doc(element.data().UserId).set({
                    "ClanData":{
                        "ClanRank":0,
                        "ClanId":element.data().ClanId,
                    },
                    "ProfileData":{
                        "AvtaarName":BotName
                    },
                    "GameProgressData":{
                        "LevelScoreData":LevelDataArray,
                        "MaxLevel":levels,
                        "TotalStars":3*levels,
                        "TotalScore":3000*levels
                    },
                    "UserId":element.data().UserId
                },{merge:true})
                // eslint-disable-next-line promise/always-return
                .then(()=>{
                    // eslint-disable-next-line promise/no-nesting
                    db.collection("Clans").doc(element.data().ClanId).update({
                        "Members":FieldValue.arrayUnion({
                            "UserId":element.data().UserId,
                             "Rank":0
                        })
                    })
                })
                .then(()=>{
                    console.log("Bots Added to Clan")
                    // eslint-disable-next-line promise/no-nesting
                    db.collection("ClanBots").doc(element.id).set({ "Status":"Deployed"},{merge:true})
                    // eslint-disable-next-line promise/always-return
                    .then(()=>{
                        let msg= db.collection("ClanChats").doc().id;
                        db.collection("ClanChats").doc(msg).set({
                            ClanId:element.data().ClanId,
                            MemberRequestStatusData:{},
                            Message:BotName+" joined",
                            MessageId:msg,                        
                            RequestData:{
                                Count:0,
                                MaxCount:0,
                                MaxDonationPerUser:0,
                                RequestItem:0
                            },
                            TimeStampInTicks:(new Date().getTime() * 10000) + 621355968000000000,
                            Type:5,
                            UserId:element.data().UserId
                        })
                    })
                    .catch(err=>{console.log(err,"ClanChats err on joining of bots")})
                })
                .catch(err=>{console.log(err)})
                }
        })
    })
        .catch(err=>{console.log(err)})
        resolve(db)
  })
}






/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */

module.exports.handle=(db)=>{
    BotClanJoin(db)
    //NextLevelJump(db)
    .then(BotLevelJump.LevelJump(db))
    .then(BotClanDonation.BotDonationProcess(db))
    .then(BotClanSmile.Smile(db))
    .then(BotClanDeletion.BotDeletion(db))
    .catch(err=>{console.log(err)})
}