
let Bot={
    "ClanData":{
        "ClanId":"",
        "ClanRank":-1,
        "TotalHelps":0,
        "WeeklyHelps":0
    },
    "GameProgressData":{
        "CurrentXP":102,
        "LevelScoreData":[],
        "MaxLevel":0,
        "TotalScore":0,
        "TotalStars":0
    },
    "GameStoreData":{
        "Boosts":{
            "Arrow":1,
            "Bomb":1,
            "DoubleCollectiable":1,
            "DoubleScore":1,
            "FireBall":1,
            "Freeze":1,
            "Magic":1,
            "None":0,
            "Parachute":1,
            "PeekUp":0,
            "PlusBalls":0,
            "Sheild":1,
            "Snake":0,
            "Splash":0,
            "SuperBomb":1,
            "ThreeBomber":0,
            "ThreeBubbles":0,
            "ThunderBubble":1
        },
        "Gems":1915,
        "Life":1,
        "Spin":1,
        "princessOutfitData":{
            "braceletUniqueId":"",
            "clothUniqueId":"C_Infant_Cloth_00",
            "earingsUniqueId":"",
            "necklaceUniqueId":"",
            "purchasedItemsIds":[],
            "shoesUniqueId":"C_Infant_Shoes_00",
            "tiaraUniqueId":""
        }
    },
        "LastUpdated":new Date(),
        "ProfileData":{
            "AvtaarId":1,
            "AvtaarName":"",
            "Email":"",
            "FbId":"",
            "GameId":"PrincessAlice",
            "GoogleId":"",
            "Name":"",
            "PhotoUrl":'',
            "TwitterId":""
        },
        "SubscribersData":{
            "Subscribers":[]
        },
        "TourneyData":{
            "BestCountryRank":0,
            "BestGlobalRank":0,
            "BestLeagueRank":0,
            "BestPremiumRank":0,
            "CurrentTourneyId":"",
            "CurrentTourneyScore":0
        },
    "UserId":""
}
module.exports.handle=(userid,db)=>{
    console.log(userid)
    db.collection("PublicUserData").doc(userid).set(Bot)
}
