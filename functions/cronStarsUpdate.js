/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
module.exports.handle=(db)=>{
    // eslint-disable-next-line promise/catch-or-return
    // db.collection("Clans").where("IsDeleted","==",false).get()
    // .then((snap)=>{
    //     snap.forEach(element => {
    //         let stars=[]
    //         // eslint-disable-next-line promise/catch-or-return
    //         db.collection("PublicUserData").where("ClanData.ClanId","==",element.id).get()
    //         .then(snapshot=>{
    //             snapshot.forEach(ele=>{
    //                 stars.push(ele.data().GameProgressData.TotalStars)
    //             })
    //                 let StarsArray = stars.filter(ele => !isNaN(ele))
    //                 console.log()
    //                 // eslint-disable-next-line promise/no-nesting
    //                 db.collection("Clans").doc(element.id).set({Stars:StarsArray.reduce((a, b) => a + b, 0),TimeStamp:new Date().toISOString()},{merge:true})
    //                 // eslint-disable-next-line promise/always-return
    //                 .then(()=>{
    //                     console.log("StarsUpdated in clan",element.id,StarsArray)
    //                 })
    //                 .catch(err=>{
    //                     console.log(err)
    //                 })
                
    //         })
    //     })
        
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
  }
  //orderby('TimeStamp','desc').limit(50)
  
  module.exports.handle=(db)=>{
        db.collection("Clans").where("IsDeleted","==",false).get()
      // eslint-disable-next-line promise/always-return
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let Id = doc.id;
          let members = doc.data().Members;
          let userId = members.map(({UserId}) => UserId);
          console.log(userId)
          let Stars = userId.map(id => {
            // eslint-disable-next-line promise/no-nesting
            return db.collection("PublicUserData").doc(id).get()
              // eslint-disable-next-line consistent-return
              .then((snapshot) => {
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
          // eslint-disable-next-line promise/no-nesting
          Promise.all(Stars)
            // eslint-disable-next-line promise/always-return
           .then((snapshot) => {
              let StarsArray = snapshot.filter(ele => !isNaN(ele))
             // console.log(members.length)
              db.collection("Clans").doc(Id).set({
                'Stars': StarsArray.reduce((a, b) => a + b, 0),
                'TotalMembers':members.length
              },{merge:true})
              console.log("stars Updated with cron in clan")
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      .catch(err => {
        console.log(err)
      })
  }