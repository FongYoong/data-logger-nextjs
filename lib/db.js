import firebase from './firebase';

/*
auth has the shape
email: "fongyoong8@gmail.com"
name: "Fong Chien Yoong"
photoUrl: "..."
token: "..."
uid: "..."
*/

//////////////////////////////////////////////
// Get ///////////////////////////////////////
//////////////////////////////////////////////

export const getUserProfile = async (watch, uid, handler) => {
  const ref = firebase.database().ref(`users/${uid}/profile`);
  if (watch) {
    ref.on('value', (snapshot) => {
      handler(snapshot.val());
    });
  }
  else{
    ref.once('value').then((snapshot) => {
      handler(snapshot.val());
    });
  }
};

export const getConfig = async (watch, successHandler) => {
  const ref = firebase.database().ref('config/');
  if (watch) {
    ref.on('value', (snapshot) => {
      successHandler(snapshot.val());
    });
  }
  else{
    ref.once('value').then((snapshot) => {
      successHandler(snapshot.val());
    });
  }
};

export const getEssentialData = async (watch, successHandler) => {
  const ref = firebase.database().ref(`essential_data/`).orderByChild('dateCreated');
  if (watch) {
    ref.on('value', (snapshot) => {
      successHandler(snapshot.val());
    });
  }
  else{
    ref.once('value').then((snapshot) => {
      successHandler(snapshot.val());
    });
  }
};

export const getConfigChanges = async (watch, successHandler) => {
  const ref = firebase.database().ref(`config_changes/`);
  if (watch) {
    ref.on('value', (snapshot) => {
      successHandler(snapshot.val());
    });
  }
  else{
    ref.once('value').then((snapshot) => {
      successHandler(snapshot.val());
    });
  }
};

//////////////////////////////////////////////
// Add ///////////////////////////////////////
//////////////////////////////////////////////

export const registerNewUser = async (authUser) => {
  firebase.database().ref(`users/${authUser.uid}/profile`).set({
    username: authUser.name,
    email: authUser.email,
    profile_picture : authUser.photoUrl
  });
};

//////////////////////////////////////////////
// Update ////////////////////////////////////
//////////////////////////////////////////////

export const updateConfig = async (uid, username, data, successHandler, errorHandler) => {
  const update = firebase.database().ref(`config/`).update({
      ...data,
  });
  const currentTimeMillis = new Date().getTime();
  const newChildRef = firebase.database().ref('config_changes/').push();
  const appendConfigChange = newChildRef.set({
    ...data,
    uid,
    username,
    dateCreated: currentTimeMillis,
  });
  Promise.all([update, appendConfigChange]).then(successHandler).catch(errorHandler);
};

//////////////////////////////////////////////
// Delete ////////////////////////////////////
//////////////////////////////////////////////

