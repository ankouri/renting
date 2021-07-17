import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import Login from './login';
import Loading from './../components/Loading';
import firebase from 'firebase'
import { useEffect ,useState} from 'react'

function MyApp({ Component, pageProps }) {
  const [user,loading] = useAuthState(auth);
  

  useEffect(()=>{
    if(user){
      var docRef = db.collection('users').doc(user.uid);
    docRef.get()
    .then((doc)=>{
        if(!doc.exists){
          db.collection("users").doc(user.uid).set(
            {
            uid:user.uid,
            email:user.email,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL:user.photoURL,
            level:0,
            tele:'xx xx xx xx xx',
            address:'Your address',
            cne:'XXXXX',
            permis:'XXXXX',
            birthDay:'XX/XX/XXXX',
            username:user.displayName
          },{
            merge:true
          })
        }
    })
    .catch((error)=>{
      console.log("Error getting document:", error);
    })
    }
 
  },[user])


  if(loading) return <Loading />;
  
  //if there is no user return Login component
  //otherwise return main component
  if(!user) return <Login />;

  return <Component {...pageProps} />
}

export default MyApp
