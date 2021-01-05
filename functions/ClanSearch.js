module.exports.handle = (snapshot, db) => {
    let Id = snapshot.id;
    let clanName = snapshot.data().Name;
    console.log("[" + Id + "]: " + clanName);

    var getKeywordsSentence = function (sentence) {
        let words = sentence.split(/\s/);
        var result = new Set();
        result.add(sentence);
        words.forEach(word => {
            result.add(word);
            var keywords = getKeywordsWord(word);
            keywords.forEach(x => {
                //console.log("x = " + x);
                result.add(x);
            });
        });
        return Array.from(result);
    }

    var getKeywordsWord = function (word) {
        word = word.toLowerCase();
        var result = [];
        for (i = 3; i <= word.length; i++) {
            for (j = 0; j <= word.length - i; j++) {
                result.push(word.slice(j, i + j));
            }
        }
        //console.log(result);
        return result;
    }
    let keywords = getKeywordsSentence(clanName);
    console.log("Adding Keywords to db: " + keywords);

    return db.collection("Clans").doc(Id).set({
        Keywords: keywords,
        TimeStamp: new Date().toISOString(),
        IsDeleted: false
    }, {
        merge: true
    });
}