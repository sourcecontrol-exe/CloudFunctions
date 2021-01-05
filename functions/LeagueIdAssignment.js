/* eslint-disable promise/no-nesting */
function levelsetter(groups,level){
	var group
	// eslint-disable-next-line array-callback-return
	Object.values(groups).filter((element)=>{
		if(element[0]<=level && level<=element[1])
			group=(Object.keys(groups)[Object.values(groups).indexOf(element)])
	})
	return group
}
var groups={
    "group1-50":[1,50],
	"group51-100":[51,100],
	"group101-150":[101,150],
	"group151-200":[151,200],
	"group201-250":[201,251],
	"group251-300":[251,300],
	"group301-350":[301,350],
	"group351-400":[351,400],
	"group401-450":[401,450],
	"group451-500":[451,500],
	"group501-600":[501,600],
	"group601-700":[601,700],
	"group701-800":[701,800],
	"group801-900":[801,900],
    "group901-1000":[901,1000]
}

module.exports.handle=(context,db)=>{
    var LeagueNumberArr=[];
    // eslint-disable-next-line promise/catch-or-return
    db.collection('TourneyScore').where("GroupId","==","").get()
    // eslint-disable-next-line consistent-return
    .then(snapshot=>{
        // eslint-disable-next-line promise/always-return
        if(snapshot.empty){
            console.log("No Sign Ups found")
            return ("No signUp with empty LeagueId")
        }
        snapshot.forEach(snap=>{
            //console.log(snap.data().UserId,"__",snap.data().TourneyId,"testing")
            var tourneyId=snap.data().TourneyId;
            var UserId=snap.data().UserId;
            console.log(UserId," ",tourneyId)
            // eslint-disable-next-line promise/catch-or-return
            db.collection("PublicUserData").doc(UserId).get()
            // eslint-disable-next-line promise/always-return
            .then(snapshot=>{
                //console.log(snapshot.data().GameProgressData.MaxLevel)
                let maxLevel=snapshot.data().GameProgressData.MaxLevel;
                let AllocatedGroup=levelsetter(groups,maxLevel)
                console.log(AllocatedGroup,tourneyId,snapshot.data().GameProgressData.MaxLevel)
                db.collection("TourneyInfo").doc(tourneyId).get()
                // eslint-disable-next-line promise/always-return
                .then(snap=>{
                    let TourneySize=snap.data().LeagueSize;
                    console.log(AllocatedGroup,"Allocated Group",TourneySize,"LeagueSize")
                    console.log(tourneyId,AllocatedGroup,"TourneyId AllCatedGroup")
                      // eslint-disable-next-line promise/catch-or-return
                    db.collection("TourneyScore").where("TourneyId","==",tourneyId).where("GroupId","==",AllocatedGroup).get()
                    .then(snapshot=>{
                         // eslint-disable-next-line promise/always-return
                        if(snapshot.empty){
                        let LeagueNumber=1;
                        let LeagueId=AllocatedGroup+"-"+LeagueNumber.toString()
                        db.collection("TourneyScore").doc(tourneyId+"|||||"+UserId).set({
                            "LeagueNumber":LeagueNumber,
                            "GroupId":AllocatedGroup,
                            "LeagueId":LeagueId,
                            "SkillScore":maxLevel
                            },{merge:true})
                            return;
                        }
                        else{
                        snapshot.forEach(snapshot=>{
                            LeagueNumberArr.push(snapshot.data().LeagueNumber)
                        })
                        let maxLeagueNumber=Math.max(...LeagueNumberArr)
                        let max_occurance= LeagueNumberArr.reduce((pre,cur)=>(cur === maxLeagueNumber) ? ++pre : pre,0)
                        console.log(maxLeagueNumber,"is max league Id assigned and",max_occurance,"is total number of times it occured")
                        let SpotsLeft= TourneySize - max_occurance;
                        console.log(SpotsLeft)
                        //let remaining = SpotsLeft;
                            // eslint-disable-next-line promise/always-return
                        if(SpotsLeft === 0){
                            maxLeagueNumber++;
                        }
                        console.log(maxLeagueNumber,SpotsLeft,"maxLeagueNumber","SpotsLeft")
                        let LeagueId=AllocatedGroup+"-"+maxLeagueNumber
                        db.collection('TourneyScore').doc(tourneyId+"|||||"+UserId).set({
                        "LeagueNumber":maxLeagueNumber,
                        "GroupId":AllocatedGroup,
                        "LeagueId": LeagueId,
                        "SkillScore": maxLevel
                        },{merge:true})   
                        }
                    })
                    .catch(err =>{
                        console.log(err)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })             
            })
            .catch(err=>{
                console.log(err)
            })

          })
          
        })   
    .catch(err=>{console.log(err)})
    
} 
//search all the documents where in tourneysignup where group ID is empty
//for each such document get the max level played by the user and allocate its group ID
// get maximum number of user with same tourneyID and same allocated group 
    //if no result found set leagueIDnumber=0, and set leagueID= AllocatedGroup+LeagueNumber
//get max LeagueNumber and empty slots for max leagueNumber from TourneySignUp
//update leagueNumber,LeagueID, and group ID for remaining slots 
//repeat