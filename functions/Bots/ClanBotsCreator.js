/* eslint-disable no-loop-func */
/* eslint-disable promise/always-return */
const BotSkeleton=require('./BotSkeleton')

function ActiveBotData(snap,db){
    return new Promise((resolve,reject)=>{
        let ActiveBotsCount= Math.floor(Math.random() *3) + 1;
        console.log(ActiveBotsCount)
        for(i=0;i<ActiveBotsCount;i++)
        {
            let userid=db.collection("PublicUserData").doc().id;
            //let LevelsToPush=Math.floor(Math.random()*9)+40;
            let join=new Date()
            join.setMinutes(join.getMinutes()+30);
            let DaysForDeletion=Math.floor(Math.random()*21)+40;
            let del=new Date();
            del.setDate(del.getDate()+DaysForDeletion)
            let jump=new Date();
            let jumptime=Math.floor(Math.random()*481)+1200;
            jump.setMinutes(jump.getMinutes()+jumptime)
            let minstodonate=Math.floor(Math.random()*116)+5;
            let donation=new Date();
            donation.setMinutes(donation.getMinutes()+minstodonate)
            db.collection("ClanBots").doc(snap.id+"|||||"+userid).set({
                "UserId":userid,
                "ClanId":snap.id,
                "BotType":"Active",
                "Status":"NotDeployed",
                "ClanJoinTime":join.toISOString(),
                "DeletionTime":del.toISOString(),
                "NextLevelJump":jump.toISOString(),
                "NextDonationTime":donation.toISOString(),
                "NextSmilyDate":"Never",
                "Donations":[]
            })
            // eslint-disable-next-line no-loop-func
            .then(()=>{
                console.log("here we are",userid)
                //let LevelsToPush=Math.floor(Math.random()*9)+40
                //console.log(LevelsToPush)
                BotSkeleton.handle(userid,db)
                
            })
            // eslint-disable-next-line no-loop-func
            .catch(err=>{
                console.log(err)
            })
        }
        console.log("Active")
        resolve(snap,db)
    })
}
function FodderBotData(snap,db){
    return new Promise((resolve,reject)=>{
        let FodderBotsCount = Math.floor(Math.random()*2)+2;
        for(i=0;i<FodderBotsCount;i++){
            let userid=db.collection("PublicUserData").doc().id;
            let join=new Date()
            join.setMinutes(join.getMinutes()+45);
            let DaysForDeletion=Math.floor(Math.random()*11)+30;
            let del=new Date();
            del.setDate(del.getDate()+DaysForDeletion)
            let jump=new Date();
            let jumptime=Math.floor(Math.random()*1441)+3600;
            jump.setMinutes(jump.getMinutes()+jumptime)
            let minstodonate=Math.floor(Math.random()*1381)+60;
            let donation=new Date();
            donation.setMinutes(donation.getMinutes()+minstodonate)
            let smile=new Date();
            smile.setDate(smile.getDate()+8)
            db.collection("ClanBots").doc(snap.id+"|||||"+userid).set({
                "UserId":userid,
                "ClanId":snap.id,
                "ClanJoinTime":join.toISOString(),
                "DeletionTime":del.toISOString(),
                "NextLevelJump":jump.toISOString(),
                "NextDonationTime":donation.toISOString(),
                "NextSmilyDate":smile.toISOString(),
                "BotType":"Fodder",
                "Status":"NotDeployed",
                "Donations":[]
            })
            .then(()=>{
                console.log("here we are",userid)
                //console.log(LevelsToPush)
                BotSkeleton.handle(userid,db)
                
            })
            // eslint-disable-next-line no-loop-func
            .catch(err=>{
                console.log(err)
            })
        }
        console.log("Fodder")
        resolve(snap,db)
    })
}

function InActiveBotData(snap,db){
    return new Promise((resolve,reject)=>{
        let InActiveBotCount = Math.floor(Math.random()*2)+3;
        for(i=0;i<InActiveBotCount;i++){
            let userid=db.collection("PublicUserData").doc().id;
            let join=new Date()
            join.setMinutes(join.getMinutes()+91);
            let DaysForDeletion=Math.floor(Math.random()*16)+15;
            let del=new Date();
            del.setDate(del.getDate()+DaysForDeletion)
            //console.log(userid)
            db.collection("ClanBots").doc(snap.id+"|||||"+userid).set({
                "UserId":userid,
                "ClanId":snap.id,
                "ClanJoinTime":join.toISOString(),
                "DeletionTime":del.toISOString(),
                "NextLevelJump":"Never",
                "NextDonationTime":"Never",
                "NextSmilyDate":"Never",
                "BotType":"InActive",
                "Status":"NotDeployed",
                "Donations":[]
            })
            .then(()=>{
                //console.log("here we are",userid)
               // console.log(LevelsToPush)
                BotSkeleton.handle(userid,db)
                
            })
            // eslint-disable-next-line no-loop-func
            .catch(err=>{
                console.log(err)
            })
        }
        console.log("Inactive")
        resolve(snap,db)
    })
}

function SpordicBots(snap,db){
    return new Promise((resolve,reject)=>{
        let SpordicBotCount = Math.floor(Math.random()*2)+3;
        for(i=0;i<SpordicBotCount;i++){
            let userid=db.collection("PublicUserData").doc().id;
            let join=new Date()
            join.setMinutes(join.getMinutes()+61);
            let DaysForDeletion=Math.floor(Math.random()*21)+20;
            let del=new Date();
            del.setDate(del.getDate()+DaysForDeletion)
            let jump=new Date();
            let jumptime=Math.floor(Math.random()*11)+10;
            jump.setDate(jump.getDate()+jumptime)
            let daystodonate=Math.floor(Math.random()*6)+10;
            let donation=new Date();
            donation.setDate(donation.getDate()+daystodonate)
            let smile=new Date();
            smile.setDate(smile.getDate()+25)
            db.collection("ClanBots").doc(snap.id+"|||||"+userid).set({
                "UserId":userid,
                "ClanId":snap.id,
                "ClanJoinTime":join.toISOString(),
                "DeletionTime":del.toISOString(),
                "NextLevelJump":jump.toISOString(),
                "NextDonationTime":donation.toISOString(),
                "NextSmilyDate":smile.toISOString(),
                "BotType":"Sporadic",
                "Status":"NotDeployed",
                "Donations":[]
            })
            .then(()=>{
                console.log("here we are",userid)
                BotSkeleton.handle(userid,db)
                
            })
            // eslint-disable-next-line no-loop-func
            .catch(err=>{
                console.log(err)
            })
        }
        console.log("Spordic")
        resolve(snap,db)
    })
}


module.exports.handle=(snap,db)=>{
ActiveBotData(snap,db)
.then(FodderBotData(snap,db))
.then(InActiveBotData(snap,db))
.then(SpordicBots(snap,db))
.catch(err=>{console.log(err)})
}
