const admin = require('firebase-admin');

const authtoken = async (req, res) => {
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      res.status(403).send('No Firebase ID token was passed as a Bearer token in the Authorization header.'+
      '\n Make sure you authorize your request by providing the following HTTP header'+
      '\n Authorization: Bearer <Firebase ID Token> or by passing a "__session" cookie.');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      idToken = req.cookies.__session;
    } else {
      res.status(403).send('Unauthorized');
      return;
    }
  
    admin.auth().verifyIdToken(idToken,true).then((payload) => {
        req.user = payload
    }).catch((error) => {
        res.status(403).json(error)
        return
    })
};

module.exports = {
    authtoken
}