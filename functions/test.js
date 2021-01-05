const firebase = require("@firebase/testing");
const fs = require("fs");

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "princess-alice";
const firebasePort = require("../firebase.json").emulators.firestore.port;
const port = firebasePort /** Exists? */ ? firebasePort : 8080;
const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("../firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

describe("My Princess Alice", () => {
  it("require users to log in before creating a profile", async () => {
    const db = authedApp(null);
    const profile = db.collection("Dummy").doc("o96ZTlWi4TZwElGpE3Kf");
    await firebase.assertFails(profile.set({ birthday: "January 1" }));
  });

  // it("should enforce the createdAt date in user profiles", async () => {
  //   const db = authedApp({ uid: "o96ZTlWi4TZwElGpE3Kf" });
  //   const profile = db.collection("Dummy").doc("o96ZTlWi4TZwElGpE3Kflice");
  //   await firebase.assertFails(profile.set({ birthday: "January 1" }));
  //   await firebase.assertSucceeds(
  //     profile.set({
  //       birthday: "January 1",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     })
  //   );
  // });

  it("should only let users create their own profile", async () => {
    const db = authedApp({ uid: "o96ZTlWi4TZwElGpE3Kf" });
    await firebase.assertSucceeds(
      db
        .collection("Dummy")
        .doc("o96ZTlWi4TZwElGpE3Kf")
        .set({
          birthday: "January 1",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    );
    await firebase.assertFails(
      db
        .collection("Dummy")
        .doc("rRoYr9gm9Qh3uzJAasZn")
        .set({
          birthday: "January 1",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    );
  });

  it("should  not let anyone read any profile", async () => {
    const db = authedApp(null);
    const profile = db.collection("Dummy").doc("rRoYr9gm9Qh3uzJAasZn");
    await firebase.assertFails(profile.get());
  });

  it("should  not let anyone create a room", async () => {
    const db = authedApp({ uid: "alice" });
    const room = db.collection("Dummy").doc("rRoYr9gm9Qh3uzJAasZn");
    await firebase.assertFails(
      room.set({
        owner: "alice",
        topic: "All Things Firebase"
      })
    );
  });

  it("should force people to name themselves as room owner when creating a room", async () => {
    const db = authedApp({ uid: "alice" });
    const room = db.collection("Dummy").doc("o96ZTlWi4TZwElGpE3Kf");
    await firebase.assertFails(
      room.set({
        owner: "scott",
        topic: "Firebase Rocks!"
      })
    );
  });

  it("should not let one user steal a room from another user", async () => {
    const alice = authedApp({ uid: "o96ZTlWi4TZwElGpE3Kf" });
    const bob = authedApp({ uid: "rRoYr9gm9Qh3uzJAasZn" });

    await firebase.assertSucceeds(
      bob
        .collection("Dummy")
        .doc("o96ZTlWi4TZwElGpE3Kf")
        .set({
          owner: "bob",
          topic: "All Things Snowboarding"
        })
    );

    await firebase.assertFails(
      alice
        .collection("Dummy")
        .doc("rRoYr9gm9Qh3uzJAasZn")
        .set({
          owner: "alice",
          topic: "skiing > snowboarding"
        })
    );
  });
});