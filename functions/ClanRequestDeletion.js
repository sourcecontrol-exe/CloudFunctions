module.exports.handle=(change,db)=>{
    console.log("Inside Request deletion")
   // let approvalClan=change.after.id;
    let present_members = change.after.data().Members
    let past_members = change.before.data().Members 
    let oldUsers=past_members.map(({UserId})=>UserId);
    let newUsers=present_members.map(({UserId})=>UserId);
    let added_user = newUsers.filter(x => !oldUsers.includes(x));
    let deletion= added_user.map(id=>{
        return db.collection("ClanChats").where("UserId","==",id).where("Type","==",2).get()
        // eslint-disable-next-line consistent-return
       .then(snapshot=>{
           // eslint-disable-next-line promise/always-return
            if(snapshot.empty){
            console.log("No SignUp Found")
            return;
        }
        snapshot.forEach(doc=>{
          //if(doc.data().ClanId !== approvalClan){  //deleting each and every request by the member to any of the clans
            let Id=doc.data().MessageId;
            let clanId=doc.data().ClanId;
            console.log(Id,doc.data(),"snapshot from Testing Table")
            // eslint-disable-next-line promise/no-nesting
            return db.collection("ClanChats").doc(Id).delete()
            // eslint-disable-next-line promise/always-return
            .then(()=>{
                const uid= ((new Date().getTime() * 10000) + 621355968000000000).toString()
                db.collection("ClanChats").doc(uid).set({
                    ClanId:clanId,
                    MessageId:uid,
                    TimeStampInTicks: (new Date().getTime() * 10000) + 621355968000000000,
                    Type:7,
                    MemberRequestStatusData:{
                        Status: "Deleted",
                        Message:"Player withdraws it's joining request",
                        RequestId:Id
                    },
                    UserId:id,
                    RequestData:{}
                    
                })
            })
            .then(()=>console.log("doc created"))
            .catch(err=>{ console.log(err)})
       // }
    })
    })
        .catch(err=>{console.log(err)})
})  
if(added_user.length!==0){
    Promise.all(deletion)
    .then(console.log("done with deletion"))
    .catch(err => { console.log(err)})
    }
}
 //being done on client side
