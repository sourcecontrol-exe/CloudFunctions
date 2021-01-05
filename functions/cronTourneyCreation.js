function days_of_a_year(year) 
{
  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}
var admin = require("firebase-admin");

module.exports.handle=(db)=>{
    let date= new Date();
    let year=date.getFullYear();
    let DaysOfYear=days_of_a_year(year)
    let CurrentDayOfYear=Math.floor((Date.now() - Date.parse(new Date().getFullYear(), 0, 0)) / 86400000)
    let RemainingDays=DaysOfYear-CurrentDayOfYear;
    let id=year-2020
    let iterator=[]
    //let data=[]
    while(RemainingDays!==0){
        iterator.push(CurrentDayOfYear.toString()+id)
        CurrentDayOfYear++;
        RemainingDays--;
    }

    let datas = [];
    let c=new Date()
for (let i=0; i < iterator.length; i++) {
    let combo=Math.floor(Math.random() * Math.floor(2))

  let data1 = {
    TourneyId:iterator[i]+Math.random().toString(36).substring(2, 15),
    TourneyStart:new Date(c.setHours(0, 0, 0, 0)).toISOString(),
    TourneyEnd:new Date(c.setHours(23, 59, 59, 0)).toISOString(),
    LeagueSize:50,
    TourneyName:"Princess Alice",
    TourneyStatus:"Live",
    WriteAllowed:false,
    TourneyRewards:{
        League:[{
            Coin:250,
            MaxRankLimit:1,
            MinRankLimit:1,
            Boosts:{
                Fireball:1,
                Bomb:1,
                Trio:1
            }
        },{
            Coin:250,
            MaxRankLimit:3,
            MinRankLimit:2,
            Boosts:{
                Fireball:1,
                Bomb:1
            }
        },{
            Coin:250,
            MaxRankLimit:5,
            MinRankLimit:4,
            Boosts:{
                Fireball:1
            }
        },{
            Coin:250,
            MaxRankLimit:10,
            MinRankLimit:6,
            Boosts:{
                Bomb:1
            }
        },{
            Coin:50,
            MaxRankLimit:25,
            MinRankLimit:10
        }]
    }

  }
  data2={
    TourneyId:iterator[i]+Math.random().toString(36).substring(2, 15),
    TourneyStart:new Date(c.setHours(0, 0, 0, 0)).toISOString(),
    TourneyEnd:new Date(c.setHours(23, 59, 59, 0)).toISOString(),
    LeagueSize:50,
    TourneyName:"Princess Alice",
    TourneyStatus:"Live",
    WriteAllowed:false,
    TourneyRewards:{
        League:[{
            Coin:250,
            MaxRankLimit:1,
            MinRankLimit:1,
            Boosts:{
                Snake:1,
                Magic:1,
                Trio:1
            }
        },{
            Coin:250,
            MaxRankLimit:3,
            MinRankLimit:2,
            Boosts:{
                Snake:1,
                Magic:1
            }
        },{
            Coin:250,
            MaxRankLimit:5,
            MinRankLimit:4,
            Boosts:{
                Snake:1
            }
        },{
            Coin:250,
            MaxRankLimit:10,
            MinRankLimit:6,
            Boosts:{
                Magic:1
            }
        },{
            Coin:50,
            MaxRankLimit:25,
            MinRankLimit:10
        }]
    }
  }
 if(combo===1){
    datas.push(data1)  
 }
 else{
    datas.push(data2)
 }
 //console.log(c,)
  c.setDate(c.getDate()+1)
}
  
async function testParallelBatchedWrites(datas) {
    let batches = [];
    let batch = admin.firestore().batch();
    let count = 0;
    while (datas.length) {
      batch.set(db.collection("TourneyInfo").doc(datas[0].TourneyId), datas.shift());
      if (++count >= 500 || !datas.length) {
        batches.push(batch.commit());
        batch = admin.firestore().batch();
        count = 0;
      }
    }
    await Promise.all(batches);
  }



  testParallelBatchedWrites(JSON.parse(JSON.stringify(datas)))
    //console.log(CurrentDayOfYear,RemainingDays)
    
}