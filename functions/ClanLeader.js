//maintains leader for old caln format

module.exports.leader=(change,Id,db)=>{
    console.log("Inside Leader Assignment")
    let persent_members=change.after.data().Members;
    console.log(persent_members)
    // let before_members=change.before.data().Members;
    let userId = persent_members.map(({UserId}) => UserId);
    console.log(userId)
    let scores = userId.map(id => {
      // eslint-disable-next-line promise/no-nesting
      return db.collection("PublicUserData").doc(id).get()
      .then(snapshot => {
        return snapshot.data().GameProgressData;
      })
      .catch(err => {
        console.log(err)
      })
    })
    // eslint-disable-next-line promise/catch-or-return
    Promise.all(scores)
    .then((snapshot)=>{
      let TotalScore = snapshot.map(({ TotalScore }) => TotalScore);
      let TotalStars = snapshot.map(({ TotalStars }) => TotalStars);
      let max_totalscore = Math.max(...TotalScore);
      let max_totalstar = Math.max(...TotalStars);
      let indexOfMaxStar = TotalStars.map((e, i) => e === max_totalstar ? i : '').filter(String)
      let indexOfMaxScore=TotalScore.indexOf(max_totalscore)
      // eslint-disable-next-line promise/always-return
      if (indexOfMaxStar.length === 1) {
        db.collection("PublicUserData").doc(userId[indexOfMaxStar[0]]).set({ClanData:{ClanRank: 3}},{merge:true})
        console.log("updated on PublicUserData with max Star",userId[indexOfMaxStar[0]])
        let leader={
          Rank:3,
          UserId: userId[indexOfMaxStar[0]]
        }
        let lead=persent_members;
        lead.splice(indexOfMaxStar[0],1)
        lead.push(leader)
        // eslint-disable-next-line promise/no-nesting
        db.collection("Clans").doc(Id).update({Members:lead})
        // eslint-disable-next-line promise/always-return
        .then(()=>{
          console.log("leader Updated with max stars")
        })
        .catch(err=>{
          console.log(err);
          })
        }
      else{
        db.collection("PublicUserData").doc(userId[indexOfMaxScore]).set({ClanData:{ClanRank:3}},{merge:true});
        console.log("updated on PublicUserData with max score",userId[indexOfMaxScore])
        let leader={
          Rank:3,
          UserId:userId[indexOfMaxScore]
          }
        let lead=persent_members;
        lead.splice(indexOfMaxScore,1);
        lead.push(leader)
        // eslint-disable-next-line promise/no-nesting
        db.collection("Clans").doc(Id).update({Members:lead})
        // eslint-disable-next-line promise/always-return
          .then(()=>{console.log("leader updated with max score");})
          .catch(err=>{console.log(err)})
      }
    })
      .catch(err=>{
        console.log(err,"ClanLeader")
      })
}