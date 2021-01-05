/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
var FieldValue = require("firebase-admin").firestore.FieldValue;

module.exports.BotDeletion=(db)=>{
    return new Promise((resolve,reject)=>{
    // eslint-disable-next-line promise/catch-or-return
    db.collection("ClanBots").where("DeletionTime","<",new Date().toISOString()).get()
    .then((snapshot)=>{
        if(snapshot.empty){
            console.log("No bots with deltion date")
        }
        else{
            snapshot.forEach(element => {
                console.log("deletion")
                let User=element.data().UserId;
                console.log("to be removed", User)
                db.collection("Clans").doc(element.data().ClanId).get()
                .then((snap)=>{
                    let members=snap.data().Members;
                    let newMembers=members.filter(i=>{ return i.UserId !== snap.data().UserId})
                    console.log(newMembers)
                    // eslint-disable-next-line promise/catch-or-return
                    db.collection("Clans").doc(element.data().ClanId).set({
                        Members:newMembers
                    })
                    .then(()=>{
                        // eslint-disable-next-line promise/catch-or-return
                        db.collection("PublicUserData").doc(User).get()
                        .then((avtar)=>{
                            let avtarname=avtar.data().ProfileData.AvtaarName
                            let msg=db.collection("ClanChats").doc().id;
                            // eslint-disable-next-line promise/catch-or-return
                            db.collection("ClanChats").doc(msg).set({
                                ClanId:element.data().ClanId,
                                MemberRequestStatusData:{},
                                Message:avtarname+" left",
                                MessageId:msg,
                                RequestData:{
                                    Count:0,
                                    MaxCount:0,
                                    MaxDonationPerUser:0,
                                    RequestItem:0 },
                                TimeStampInTicks:(new Date().getTime() * 10000) + 621355968000000000,
                                Type: 6,
                                UserId:User
                            })
                            .then(()=>{
                                // eslint-disable-next-line promise/catch-or-return
                                db.collection("ClanBots").doc(element.id).delete()
                                .then(()=>{
                                    db.collection("PublicUserData").doc(User).delete()
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                            })                
                        })
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            });





            // snapshot.forEach(element => {
            //     let user=element.data().UserId
            //     console.log(user)
            //     db.collection("Clans").doc(element.data().ClanId).get()
            //     .then(snap=>{
            //         let members=snap.data().Members
            //         let newMembers=members.filter(i=>{return i.UserId !==snap.data().UserId})
            //         console.log(newMembers)
            //         db.collection("Clans").doc(element.data().ClanId).set({
            //             Members:newMembers
            //         },{merge:true})
            //         // eslint-disable-next-line promise/always-return
            //         .then(()=>{
            //             let msg=db.collection("ClanChats").doc().id;
            //             // eslint-disable-next-line promise/catch-or-return
            //             db.collection("ClanChats").doc(msg).set({
            //                 ClanId:element.data().ClanId,
            //                 MemberRequestStatusData:{},
            //                 Message:snap.data().ProfileData.AvtaarName+" left",
            //                 MessageId:msg,
            //                 RequestData:{
            //                     Count:0,
            //                     MaxCount:0,
            //                     MaxDonationPerUser:0,
            //                     RequestItem:0
            //                 },
            //                 Type: 6,
            //                 UserId:user
            //             })                 
            //             .then(()=>{
            //             return db.collection("PublicUserData").doc(user).delete()
            //             })
            //         })
            //     })
            //         .catch(err=>{console.log(err)})
            //     })
            //     .catch(err=>{console.log(err)})
            // })
        }
    })
    .catch(err=>{console.log(err)})
    resolve(db)
})
}