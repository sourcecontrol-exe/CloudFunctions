module.exports.handle=(context,db)=>{
// eslint-disable-next-line promise/catch-or-return
db.collection('PublicUserData').get()
 .then(snapshot=>{
   // eslint-disable-next-line promise/always-return
   if(snapshot.empty){
     console.log("no Matching document found");
     return
   }
   // eslint-disable-next-line promise/no-nesting
   snapshot.forEach(doc=>{
     console.log(doc.id,"=>",doc.data());
     db.collection("PublicUserData").doc(doc.id).set({ClanData:{WeeklyHelps:0}},{merge:true})
   })
   .catch(err=>{
     console.log(err);
   })
 })
    
}