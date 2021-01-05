/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
module.exports.handle=(change,db)=>{
    console.log("Inside Request deletion")
    let ClanId=change.after.data().ClanId;
    let persent_members = change.after.data().TotalMembers;
    let past_members = change.before.data().TotalMembers;
    if(persent_members>past_members){
        let clanjointime=new Date()
        clanjointime.setMinutes(clanjointime.getMinutes()-5)
        let users=[]
        
    db.collection("PublicUserData").where("ClanData.ClanId","==",ClanId).get()
    .then(snapshot=>{
        snapshot.forEach(ele=>{
            if(ele.data().ClanData.ClanJoinTime>clanjointime.toISOString())
            {
                users.push(ele.data().UserId)
                console.log(clanjointime.toISOString(),ele.data().ClanData.ClanJoinTime)

            }
        })
        let deletion=users.map(id=>{
            return db.collection("ClanChats").where("UserId",'==',id).where("Type","==",2).get()
            .then(snap=>{
                if(snap.empty){
                    console.log("no other requests by user",id)
                }
                snap.forEach(doc=>{
                    let requestedClan=doc.data().ClanId;
                    let messageId=doc.data().MessageId;
                    return db.collection("ClanChats").doc(messageId).delete()
                    .then(()=>{
                       const docid= db.collection("ClanChats").doc().id
                       db.collection("ClanChats").doc(docid).set({
                        ClanId:requestedClan,
                        MessageId:docid,
                        TimeStampInTicks: (new Date().getTime() * 10000) + 621355968000000000,
                        Type:7,
                        MemberRequestStatusData:{
                            Status: "Deleted",
                            Message:"Player withdraws it's joining request",
                            RequestId:messageId
                        },
                        UserId:id,
                        RequestData:{}
                        })
                    })
                })
            })
            .catch(err=>{
                console.log(err)
            })
        })
    Promise.all(deletion)
        .then(console.log("Done with Deletion"))
        .catch(err=>{console.log(err)})
    })
    .catch(err=>{
        console.log(err)
    })
}
}

//    let approvalClan=change.after.id;
//     let present_members = change.after.data().Members
//     let past_members = change.before.data().Members 
//     let oldUsers=past_members.map(({UserId})=>UserId);
//     let newUsers=present_members.map(({UserId})=>UserId);
//     let added_user = newUsers.filter(x => !oldUsers.includes(x));
//     let deletion= added_user.map(id=>{
//         return db.collection("ClanChats").where("UserId","==",id).where("Type","==",2).get()
//         // eslint-disable-next-line consistent-return
//        .then(snapshot=>{
//            // eslint-disable-next-line promise/always-return
//             if(snapshot.empty){
//             console.log("No SignUp Found")
//             return;
//         }
//         snapshot.forEach(doc=>{
//           //if(doc.data().ClanId !== approvalClan){  //deleting each and every request by the member to any of the clans
//             let Id=doc.data().MessageId;
//             let clanId=doc.data().ClanId;
//             console.log(Id,doc.data(),"snapshot from Testing Table")
//             // eslint-disable-next-line promise/no-nesting
//             return db.collection("ClanChats").doc(Id).delete()
//             // eslint-disable-next-line promise/always-return
//             .then(()=>{
//                 const uid= ((new Date().getTime() * 10000) + 621355968000000000).toString()
//                 db.collection("ClanChats").doc(uid).set({
//                     ClanId:clanId,
//                     MessageId:uid,
//                     TimeStampInTicks: (new Date().getTime() * 10000) + 621355968000000000,
//                     Type:7,
//                     MemberRequestStatusData:{
//                         Status: "Deleted",
//                         RequestId:Id
//                     }
//                 })
//             })
//             .then(()=>console.log("doc created"))
//             .catch(err=>{ console.log(err)})
//        // }
//     })
//     })
//         .catch(err=>{console.log(err)})
// })  
// if(added_user.length!==0){
//     Promise.all(deletion)
//     .then(console.log("done with deletion"))
//     .catch(err => { console.log(err)})
//     }
