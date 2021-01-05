//On updation of a clan 
//----will update stars if the member is added or removed
//----will set clan leader if the leader leaves the clan
//----will delete unapproved clan requests from clanchats on closed clans


const ClanStarsCalcultor= require('./ClanStarsCalculatorNew')


module.exports.handle=(change,db)=>{
  //let Id = change.after.data();
  //console.log(change.after.data().ClanId)
  let persent_members = change.after.data().TotalMembers;
  let past_members = change.before.data().TotalMembers;
  console.log(persent_members)
  
  if(persent_members !== past_members){
    //console.log(Id)
    console.log(persent_members,"present",past_members,"past")
    ClanStarsCalcultor.FetchMemberStars(change,db)
  }
}




