const MAX_LEVEL = "MaxLevel";
const GROUP_NAME = "Group";

var groupsArr = [
    {
        MAX_LEVEL : 100,
        GROUP_NAME : "G1-100"
    },
    {
        MAX_LEVEL : 1000,
        GROUP_NAME : "G101-1001"
    },
    {
        MAX_LEVEL : 10000,
        GROUP_NAME : "G1001-10000"
    },
]

/* eslint-disable promise/no-nesting */
module.exports.getGroupId =  function(level) {
    if (level > 0) {
        let item = groupsArr.find(function(dict) {
            if (level < dict.MAX_LEVEL) {
                return dict.GROUP_NAME;
            }
        });
        if (item) {
            return item.GROUP_NAME;
        }
    }
    return "DefaultMaxGroup";
}

/*
console.log("32= " + getGroupId(32));
console.log("999999= " + getGroupId(999999));
console.log("1= " + getGroupId(1));
console.log("0= " + getGroupId(0));
console.log("-1= " + getGroupId(-1));
console.log("102= " + getGroupId(102));
console.log("999= " + getGroupId(999));
console.log("9999= " + getGroupId(9999));
*/
