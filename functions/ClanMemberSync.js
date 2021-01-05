module.exports.handle=(change,db)=>{
    if(typeof(change.after.data().Members)!== undefined && change.after.data().Members !== change.after.data().TotalMembers){
        let clanId=change.after.data().ClanId;
        let members=[]
        // eslint-disable-next-line promise/catch-or-return
        db.collection("PublicUserData").where("ClanData.ClanId","==",clanId).get()
        .then(snap=>{
            // eslint-disable-next-line promise/always-return
            if(snap.empty){
                console.log('no member for ',clanId)
            }
            snap.forEach(element => {
                members.push({
                    UserId:element.data().UserId,
                    Rank:element.data().ClanData.ClanRank
                })
            })
            console.log(members)
            //db.collection("Clans").doc(clanId).update({Members:members})
        })
    }
  }