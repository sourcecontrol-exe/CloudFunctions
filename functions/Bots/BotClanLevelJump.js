/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */


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


module.exports.LevelJump=(db)=>{
    return new Promise((resolve,reject)=>{
        db.collection("ClanBots").where("NextLevelJump","<=",new Date().toISOString()).get()
        .then(snapshot=>{
            // eslint-disable-next-line promise/always-return
            if(snapshot.empty){
                console.log("No bots updated")
            }
            snapshot.forEach(element=>{
                console.log(element.data().UserId,element.data().BotType)
               if(element.data().BotType==="Active") {
                   console.log("here i was")
                    let jump=new Date();
                    let jumptime=Math.floor(Math.random()*481)+1200;
                    jump.setMinutes(jump.getMinutes()+jumptime)
                    let levelJump=Math.floor(Math.random()*3)+6;
                    // eslint-disable-next-line promise/no-nesting
                    db.collection("ClanBots").doc(element.id).set({
                        "NextLevelJump":jump.toISOString()    
                    },{merge:true})
                    .then(()=>{
                        return db.runTransaction(transaction=>{
                           // eslint-disable-next-line promise/no-nesting 
                           return transaction.get(db.collection("PublicUserData").doc(element.data().UserId))
                           // eslint-disable-next-line promise/always-return
                           .then(snap=>{
                            let leveldata=levelUpdate(levelJump,snap.data().GameProgressData.MaxLevel)
                            //console.log(leveldata)
                            let OldLevelData=snap.data().GameProgressData.LevelScoreData
                            let newLevelData=OldLevelData.concat(leveldata)
                            let maxLevel=snap.data().GameProgressData.MaxLevel+levelJump;
                            transaction.update(db.collection("PublicUserData").doc(snap.data().UserId),"GameProgressData",{ 
                                    "LevelScoreData":newLevelData,
                                    "CurrentXP":3*(maxLevel-1),
                                    "MaxLevel":maxLevel,
                                    "TotalScore":3000*maxLevel,
                                    "TotalStars":3*maxLevel
                                })
                            })   
                        })
                    })
                }
                else if(element.data().BotType==="Sporadic"){
                    console.log("Sporadic")
                    let jump=new Date();
                    let jumptime=Math.floor(Math.random()*1441)+3600;
                    jump.setMinutes(jump.getMinutes()+jumptime)
                    let levelJump=Math.floor(Math.random()*3)+6
                    // eslint-disable-next-line promise/no-nesting
                    db.collection("ClanBots").doc(element.id).set({
                        "NextLevelJump":jump.toISOString()    
                    },{merge:true})
                    .then(()=>{
                        return db.runTransaction(transaction=>{
                            // eslint-disable-next-line promise/no-nesting 
                            return transaction.get(db.collection("PublicUserData").doc(element.data().UserId))
                            // eslint-disable-next-line promise/always-return
                            .then(snap=>{
                             let leveldata=levelUpdate(levelJump,snap.data().GameProgressData.MaxLevel)
                             //console.log(leveldata)
                             let OldLevelData=snap.data().GameProgressData.LevelScoreData
                             let newLevelData=OldLevelData.concat(leveldata)
                             let maxLevel=snap.data().GameProgressData.MaxLevel+levelJump;
                             transaction.update(db.collection("PublicUserData").doc(snap.data().UserId),"GameProgressData",{ 
                                     "LevelScoreData":newLevelData,
                                     "MaxLevel":maxLevel,
                                     "CurrentXP":3*(maxLevel-1),
                                     "TotalScore":3000*maxLevel,
                                     "TotalStars":3*maxLevel
                                 })
                             })   
                         })
                    })
                }
                else if(element.data().BotType==="Fodder"){
                    console.log("Fodder")
                    let jump=new Date();
                    let jumptime=Math.floor(Math.random()*11)+10;
                    jump.setMinutes(jump.getDate()+jumptime)
                    let levelJump=Math.floor(Math.random()*3)+6
                    // eslint-disable-next-line promise/no-nesting
                    db.collection("ClanBots").doc(element.id).set({
                        "NextLevelJump":jump.toISOString()    
                    },{merge:true})
                    .then(()=>{
                        return db.runTransaction(transaction=>{
                            // eslint-disable-next-line promise/no-nesting 
                            return transaction.get(db.collection("PublicUserData").doc(element.data().UserId))
                            // eslint-disable-next-line promise/always-return
                            .then(snap=>{
                             let leveldata=levelUpdate(levelJump,snap.data().GameProgressData.MaxLevel)
                             //console.log(leveldata)
                             let OldLevelData=snap.data().GameProgressData.LevelScoreData
                             let newLevelData=OldLevelData.concat(leveldata)
                             let maxLevel=snap.data().GameProgressData.MaxLevel+levelJump;
                             transaction.update(db.collection("PublicUserData").doc(snap.data().UserId),"GameProgressData",{ 
                                     "LevelScoreData":newLevelData,
                                     "MaxLevel":maxLevel,
                                     "TotalScore":3000*maxLevel,
                                     "CurrentXP":3*(maxLevel-1),
                                     "TotalStars":3*maxLevel
                                    })
                                })   
                            })
                        })
                    }
                })
            })
        .catch(err=>{console.log(err,"LevelUpdate")})
        resolve(db)
    })
}
