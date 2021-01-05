const ClanLeader = require('./ClanLeader')
//const ClanRequestDeletion = require('./ClanRequestDeletion')
// after stars updation  
module.exports.FetchMemberStars=(change,db)=>{
  
    let Id = change.after.data().ClanId
    let past_members=change.before.data().Members
    let persent_members=change.after.data().Members;
    let userId = persent_members.map(({UserId}) => UserId);
    let rank = persent_members.map(({ Rank }) => Rank);  
    // eslint-disable-next-line array-callback-return
    let stars = userId.map(id => {
      return db.collection("PublicUserData").doc(id).get()
        // eslint-disable-next-line consistent-return
        .then((snapshot) => {
          //console.log(id,"=>",snapshot.data().GameProgressData.TotalStars)
          // eslint-disable-next-line promise/always-return
          if(snapshot.data()!== undefined){
            return snapshot.data().GameProgressData.TotalStars;
          }
          else
            console.log(id,"=>","data undefined")
         })
        .catch(err => {
          console.log(err)
        })
   })
    Promise.all(stars)
    // eslint-disable-next-line promise/always-return
    .then(snapshot => {
      console.log(snapshot,"in promise all stars")
      let StarsArray=snapshot.filter(ele=>!isNaN(ele))   
      db.collection("Clans").doc(Id).set({'Stars': StarsArray.reduce((a, b) => a + b, 0),'TotalMembers':persent_members.length},{merge:true})  
      console.log("promise executed") 
      //eslint-disable-next-line promise/always-return
      if(!rank.includes(3) && persent_members<past_members){
          console.log("rank include here and a member is removed")
        ClanLeader.leader(change,Id,db)
      }
      //eslint-disable-next-line promise/always-return
      else if(persent_members>past_members && rank.includes(3)){
          console.log("deleting all others clan request")
        // ClanRequestDeletion.requestDeletion(change,db)
      }
      else if(persent_members.length===0){
        db.collection("Clans").doc(Id).set({IsDeleted:true},{merge:true})
        console.log("Is deleted Set to false")
      }
    })
    .catch(err =>{
      console.log(err,"yeahn aayi error")
    })
}

//calculate total stars in the clan, maintains clan leader 