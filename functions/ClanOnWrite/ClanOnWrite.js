module.exports.handle = (change, context) => {
    let clanId = context.params.clanId;
    const data = change.after.exists ? change.after.data() : null;
    const oldData = change.before.exists ? change.before.data() : null;
    // If newDoc is null, document is deleted
    // If oldDoc is null, document is new created


    console.log("-------------" + clanId + " ------ ");
    console.log(JSON.stringify(oldData, null, 2));
    console.log("-------------" + clanId + " ------ ");
    console.log(JSON.stringify(data, null, 2));
    console.log("-------------" + clanId + " ------ ");

    // If name have changed, let's regenerate keywords
    if (data && data.Name) {
        if (!oldData || data.Name != oldData.Name) {
            const addClanKeywords = require('./GetSearchKeywords.js');
            let keywords = addClanKeywords.getKeywordsFromSentence(data.Name);
            console.log("Adding Keywords to db: " + keywords);

            return change.after.ref.set({
                Keywords: keywords,
                TimeStamp: new Date().toISOString(),
                IsDeleted: false
            }, {
                merge: true
            });
        }
    }

}
