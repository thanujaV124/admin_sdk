// add admin
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert("./sindhi-college-c982d-firebase-adminsdk-lr537-49164ac682.json"),
    databaseURL: 'https://sindhi-college-c982d.firebaseio.com'
});


const uid = "nBebMzxQYyT4Re0RFJPwFpAf9BE2";

return admin
    .auth()
    .setCustomUserClaims(uid, { admin: true })
    .then(() => {
        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.
        console.log(`Admin claim added to ${uid}`)
    });


