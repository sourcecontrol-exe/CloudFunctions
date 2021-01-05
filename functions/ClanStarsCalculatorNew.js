/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
//const ClanLeader = require('./ClanLeaderNew')
//const ClanRequestDeletion = require('./ClanRequestDeletion')
// after stars updation  
module.exports.FetchMemberStars=(change,db)=>{
  let clanId=change.after.data().ClanId;
  let past_members=change.before.data().TotalMembers;
  let persent_members=change.after.data().TotalMembers;
  let stars=[];
  let rank=[];
  let members=[];
  let score=[];
  console.log(clanId)
  // eslint-disable-next-line promise/catch-or-return
  db.collection("PublicUserData").where("ClanData.ClanId","==",clanId).get()
  .then(snapshot=>{
    // eslint-disable-next-line promise/always-return
    if(snapshot.empty){
      console.log("No Useer with same clan Id")
    }
    console.log(clanId,"Members",snapshot.length)
    snapshot.forEach(ele=>{
      //console.log("TotalStars","TotoalScore","ClanRank",ele.data().GameProgressData.TotalStars,ele.data().GameProgressData.TotalScore,ele.data().ClanData.ClanRank)
      stars.push(ele.data().GameProgressData.TotalStars)
      score.push(ele.data().GameProgressData.TotalScore)
      members.push(ele.data().UserId)
      rank.push(ele.data().ClanData.ClanRank)
    })
    
    console.log(stars,members,rank)
    let FilterStars=stars.filter(star=>!isNaN(star))
    let FilterRank=rank.filter(ele=>!isNaN(ele))
    console.log(FilterStars,FilterRank)
    db.collection("Clans").doc(clanId).set({'Stars': FilterStars.reduce((a, b) => a + b, 0),'TotalMembers':members.length},{merge:true})
    .then(()=>{
      console.log(FilterStars,"Updated in Clan",clanId)
      if(!rank.includes(3) && persent_members<past_members){
        console.log("Leader left the clan assig new leader")
        let max_totalscore = Math.max(...score);
        let max_totalstar = Math.max(...stars);
        console.log(max_totalstar,max_totalscore,"maxstar and score")
        let indexOfMaxStar = stars.map((e, i) => e === max_totalstar ? i : '').filter(String)
        let indexOfMaxScore=score.indexOf(max_totalscore)
        if(indexOfMaxStar.length === 1){
          console.log("insideif length==1")
          console.log(members,indexOfMaxStar,indexOfMaxScore,members[indexOfMaxStar[0]])
          db.collection("PublicUserData").doc(members[indexOfMaxStar[0]]).set({ClanData:{ClanRank:3}},{merge:true})
        }
        else{
          console.log("inside else")
          db.collection("PublicUserData").doc(members[indexOfMaxScore]).set({ClanData:{ClanRank:3}},{merge:true})
        }
      }
      else if(persent_members>past_members && rank.includes(3)){
        console.log("members Joined Deleting all Clan Request")
    }
    else if(persent_members<past_members && persent_members===0){
      db.collection("Clans").doc(ClanId).set({IsDeleted:true},{merge:true})
    }
})
.catch(err=>{
  console.log(err)
})
})
.catch(err=>{
console.log(err)
})
}
        // members.forEach(ele=>{
        //   db.collection("ClanChats").where("UserId","==",ele).where("Type","==",2).get()
        //   .then(snap=>{
        //     if(snap.empty)
        //     {
        //       console.log("no active request for member")
        //     }
        //     else{
        //       snap.forEach(element=>{
        //         let Id=element.data().MessageId;
        //         let clanId=element.data().ClanId;
        //         db.collection("ClanChats").doc(Id).delete()
        //         .then(()=>{
        //           const uid=((new Date().getTime() * 10000) + 621355968000000000).toString()
        //           db.collection("ClanChats").doc(uid).set({
        //             ClanId:clanId,
        //             MessageId:uid,
        //             TimeStampInTicks: (new Date().getTime() * 10000) + 621355968000000000,
        //             Type:7,
        //             MemberRequestStatusData:{
        //               Status: "Deleted",
        //               RequestId:Id
        //             }
        //           })
        //         })
        //         .catch(err=>{
        //           console.log(err)
        //         })
        //       })
        //     }
        //   })
        //   .catch(err=>{console.log(err)})
        // })
     
    // .then(()=>{
    //   console.log("starsUpdated for caln",clanId)
    //   if(!FilterRank.includes(3) && persent_members<past_members){
    //     console.log("Leader left the clan assig new leader")
    //     console.log(stars,score)
    //   let max_totalscore = Math.max(...score);
    //   let max_totalstar = Math.max(...stars);
    //   console.log(max_totalscore,"Maxtotalsocre",max_totalstar,"Maxtotlastar")
    //   let indexOfMaxStar = stars.map((e, i) => e === max_totalstar ? i : '').filter(String)
    //   console.log(indexOfMaxStar,"indexofmaxstar")
    //   let indexOfMaxScore=score.indexOf(max_totalscore)
    //   if(indexOfMaxStar.length === 1){
    //     console.log("insideif length==1")
    //     db.collection("PublicUserData").doc(members[indexOfMaxStar[0]]).set({ClanData:{ClanRank:3}},{merge:true})
    //     console.log("updated on PublicUserData with max Star",userId[indexOfMaxStar[0]])
    //   }
    //   else{
    //     console.log("inside else")
    //     db.collection("PublicUserData").doc(members[indexOfMaxScore]).set({ClanData:{ClanRank:3}},{merge:true})
    //     console.log("updated on PublicUserData with max score",userId[indexOfMaxScore])
    //   }
    //   }
    //   else if(persent_members>past_members && rank.includes(3)){
    //     console.log("members Joined Deleting all Clan Request")
    //     members.forEach(ele=>{
    //       db.collection("ClanChats").where("UserId","==",ele).where("Type","==",2).get()
    //       .then(snap=>{
    //         if(snap.empty){
    //           console.log("no other request")
    //         }
    //         snap.forEach(element=>{
    //           let Id=element.data().MessageId;
    //           let clanId=element.data().ClanId;
    //           db.collection("ClanChats").doc(Id).delete()
    //           // eslint-disable-next-line promise/always-return
    //           .then(()=>{
    //             const uid=((new Date().getTime() * 10000) + 621355968000000000).toString()
    //             db.collection("ClanChats").doc(uid).set({
    //               ClanId:clanId,
    //               MessageId:uid,
    //               TimeStampInTicks: (new Date().getTime() * 10000) + 621355968000000000,
    //               Type:7,
    //               MemberRequestStatusData:{
    //                   Status: "Deleted",
    //                   RequestId:Id
    //               }
    //           })
    //           })
    //           .then(()=>console.log("doc created"))
    //         .catch(err=>{ console.log(err)})
    //         })
    //       })
    //       .catch(err=>{console.log(err)})
    //     })
    //   }
    // })
    // .catch(err=>{
    //   console.log(err)
    // })

  
  //   let Id = change.after.data().ClanId
  //   let past_members=change.before.data().Members
  //   let persent_members=change.after.data().Members;
  //   let userId = persent_members.map(({UserId}) => UserId);
  //   let rank = persent_members.map(({ Rank }) => Rank);  
  //   // eslint-disable-next-line array-callback-return
  //   let stars = userId.map(id => {
  //     return db.collection("PublicUserData").doc(id).get()
  //       // eslint-disable-next-line consistent-return
  //       .then((snapshot) => {
  //         //console.log(id,"=>",snapshot.data().GameProgressData.TotalStars)
  //         // eslint-disable-next-line promise/always-return
  //         if(snapshot.data()!== undefined){
  //           return snapshot.data().GameProgressData.TotalStars;
  //         }
  //         else
  //           console.log(id,"=>","data undefined")
  //        })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //  })
  //   Promise.all(stars)
  //   // eslint-disable-next-line promise/always-return
  //   .then(snapshot => {
  //     console.log(snapshot,"in promise all stars")
  //     let StarsArray=snapshot.filter(ele=>!isNaN(ele))   
  //     db.collection("Clans").doc(Id).update({'Stars': StarsArray.reduce((a, b) => a + b, 0)})  
  //     console.log("promise executed") 
  //     //eslint-disable-next-line promise/always-return
  //     if(!rank.includes(3) && persent_members<past_members){
  //         console.log("rank include here and a member is removed")
  //       ClanLeader.leader(change,Id,db)
  //     }
  //     //eslint-disable-next-line promise/always-return
  //    else if(persent_members>past_members && rank.includes(3)){
  //         console.log("deleting all others clan request")
  //       // ClanRequestDeletion.requestDeletion(change,db)
  //     }
      
  //   })
  //   .catch(err =>{
  //     console.log(err,"yeahn aayi error")
  //   })


//calculate total stars in the clan, maintains clan leader 