export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA8XOhDCgnNu9uVdpb1fe0eJK5TPDBZ8s4",
  authDomain: "comanda-b0449.firebaseapp.com",
  databaseURL: "https://comanda-b0449.firebaseio.com",
  projectId: "comanda-b0449",
  storageBucket: "comanda-b0449.appspot.com",
  messagingSenderId: "940730841798",
  appId: "1:940730841798:web:addfef20581dcfd4"
};

export const snapshotToArray = snapshot => {
  let returnArray = [];
  snapshot.forEach(element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });

  return returnArray;
}