module.exports.handle=(snapshot,db)=>{
    let Id=snapshot.id;
    let enddate= new Date()
    enddate.setMinutes(enddate.getMinutes()+60)
    db.collection("TeamChestInfo").doc(Id).set({
        EventId:Id,
        EventStart:new Date().toISOString(),
        EventEnd:enddate.toISOString(),
        Status:"Testing",
        TeamChestRewards:{
            BronzeTier:{
                Coin:500,
            TargetGems:500
        },
        GoldenTier:{
            Boosts:{
                Fireball:1,
                Magic:1
            },
            Coin:2000,
            TargetGems:2000
        },
        SilverTier:{
            Boosts:{
                Fireball:1
            },
            Coin:1000,
            TargetGems:1000
        }
    }
    })
}