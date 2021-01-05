/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */

function setDonationDate(type){
    let donation=new Date();
    if(type==="Active"){
    let minstodonate=Math.floor(Math.random()*116)+5;
    donation.setMinutes(donation.getMinutes()+minstodonate)
    }
    else if(type==="Sporadic"){
    let daystodonate=Math.floor(Math.random()*6)+10;
    donation.setDate(donation.getDate()+daystodonate)
    }
    else if(type==="Fodder"){
    let minstodonate=Math.floor(Math.random()*1381)+60;
    donation.setMinutes(donation.getMinutes()+minstodonate)
    }
    return donation
}

module.exports.BotDonationProcess=(db)=>{
    return new Promise((resolve,reeject)=>{
        db.collection("ClanBots").where("NextDonationTime","<",new Date().toISOString()).get()
        .then((snapshot)=>{
            if(snapshot.empty){
                console.log("no such doc")
            }
            else{
                snapshot.forEach(element=>{
                    let type=element.data().BotType;
                    let clanId=element.data().ClanId;
                    let userId=element.data().UserId;
                    let donations=element.data().Donations;
                    if(element.data().Status==="Deployed"){
                        db.collection("ClanChats").where("ClanId","==",clanId).where("Type","==",1).get()
                            .then(snap=>{
                                if(snap.empty)
                                {
                                    console.log("No Document with clanId"+clanId+"and Type 1")
                                }
                                else{
                                    // eslint-disable-next-line consistent-return
                                    snap.forEach(doc=>{
                                        if(doc.data().RequestData.Count<doc.data().RequestData.MaxCount &&!donations.includes(doc.data().MessageId)){
                                            console.log(doc.data().MessageId);
                                            let requestedUser=doc.data().UserId;
                                            //let count=doc.data().RequestData.Count+1;
                                            let messageId=doc.data().MessageId;
                                            let item=doc.data().RequestData.RequestItem;
                                            return db.runTransaction(transaction=>{
                                                return transaction.get(db.collection("ClanChats").doc(doc.data().MessageId))
                                                .then((chatsnap)=>{
                                                   // if(chatsnap.data().RequestData.Count<chatsnap.data().RequestData.MaxCount){
                                                    let count= chatsnap.data().RequestData.Count+1
                                                    //console.log(count)
                                                    transaction.update(db.collection("ClanChats").doc(doc.data().MessageId),"RequestData",{
                                                        Count:count,
                                                        MaxCount:chatsnap.data().RequestData.MaxCount,
                                                        MaxDonationPerUser:chatsnap.data().RequestData.MaxDonationPerUser,
                                                        RequestItem:chatsnap.data().RequestData.RequestItem
                                                    })
                                                //}
                                                })
                                                .catch(err=>{
                                                    if(err instanceof TypeError){
                                                    console.log("This error is handled")
                                                    }
                                                    else
                                                    console.log(err)
                                                })
                                            })
                                            .then(()=>{
                                                db.collection("ClanDonations").doc(messageId+"|||||"+userId).set({
                                                    ClanId:clanId,
                                                    Count:1,
                                                    DonatedToUserId:requestedUser,
                                                    Item:item,
                                                    RequestId:messageId,
                                                    Status:"Pending",
                                                    UserId:userId
                                                })
                                            .then(()=>{
                                                donations.push(messageId)
                                                let DonationReal=donations.filter((el)=>{return el !==""})
                                                let donationDate=setDonationDate(type)
                                                db.collection("ClanBots").doc(clanId+"|||||"+userId).set({
                                                    Donations:DonationReal,
                                                    NextDonationTime:donationDate.toISOString()
                                                },{merge:true})
                                            })
                                            .catch(err=>{console.log(err)})
                                            })
                                        }
                                    })
                                }
                            })
                            
                        }
                    })
                }
            })
            .catch(err=>{console.log(err,"ClanDonation")})
            resolve(db)
        })
    }

