/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
function smileDateUpdate(type){
    let emoji=new Date();
    if(type==="Sporadic"){
        emoji.setDate(emoji.getDate()+25)
    }
    else if(type==="Fodder"){
        emoji.setDate(emoji.getDate()+8)
    }
    return emoji
}
module.exports.Smile=(db)=>{
    return new Promise((resolve,reject)=>{
    db.collection("ClanBots").where("NextSmilyDate","<",new Date().toISOString()).get()
    .then((snapshot)=>{
        // eslint-disable-next-line promise/always-return
        if(snapshot.empty){
            console.log("snapshot is empty for smile")
            return
        }
        else{
            snapshot.forEach(element => {
            
            db.collection("PublicUserData").doc(element.data().UserId).get()
            // eslint-disable-next-line promise/always-return
            .then(snap=>{
            let messageid=db.collection("ClanChats").doc().id
            let type=element.data().Type
            let user=element.data().UserId
            let clan=element.data().ClanId
            // eslint-disable-next-line promise/no-nesting
            db.collection("ClanChats").doc(messageid).set({
                ClanId:element.data().ClanId,
                MemberRequestStatusData:{},
                Message:"😊",
                MessageId:messageid,
                RequestData:{
                    Count:0,
                    MaxCount:0,
                    MaxDonationPerUser:0,
                    RequestItem:0
                },
                Sendername:snap.data().ProfileData.AvtaarName,
                TimeStampInTicks:(new Date().getTime() * 10000) + 621355968000000000,
                Type:0,
                UserId:element.data().UserId
                })
            // eslint-disable-next-line promise/always-return
                .then(()=>{
                    let nextsmile=smileDateUpdate(type)
                    console.log(nextsmile,"next smile date")
                    console.log(clan+"|||||"+user)
                    db.collection("ClanBots").doc(clan+"|||||"+user).set({
                        NextSmilyDate: nextsmile.toISOString()
                },{merge:true})
                })
                .catch(err=>console.log(err))
            })        
        })
        }
    })
    .catch(err=>{console.log(err)})
    resolve(db)
})
}

                            