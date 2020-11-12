const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: 'https://bolt-campaigns.firebaseio.com'
});

var highScoresDb = (firebaseAdmin.database().ref('bolt-safety-captcha/high-scores'));

exports.boltCaptchaFilterHighScores = functions.https.onRequest((req, res) => {
  let country = req.query.country ? req.query.country : "Nigeria";
  let limit = req.query.limit ? parseInt(req.query.limit) : 30;

  highScoresDb
    .orderByChild("country")
    .equalTo(country)
    .once("value", function (snapshot) {
      let highscores = snapshot.val();
      highscores = Object.values(highscores);
      highscores = highscores
        .sort((a,b) => a.score > b.score ? -1 : 1)
        .slice(0, limit);
      res.json(highscores);
    });
});