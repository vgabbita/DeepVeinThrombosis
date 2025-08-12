// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: javascript associated with allowing a user to SignIn to their account

// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
  
  import { getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCVUNW2TmudxByNY8kqS8YL6JLGDVAMFKA",
    authDomain: "wsfb-6f772.firebaseapp.com",
    databaseURL: "https://wsfb-6f772-default-rtdb.firebaseio.com",
    projectId: "wsfb-6f772",
    storageBucket: "wsfb-6f772.appspot.com",
    messagingSenderId: "960408174494",
    appId: "1:960408174494:web:0e0b3ecbbb21fbf532a08f"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Initialize authentication
const auth = getAuth();

//Return instance of your app's FRD
const db = getDatabase(app);

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function(){
    // Get user's email and password for sign in
    console.log('Clicked');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    //console.log(email, password);

    // Attempt user sign in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create a user and store the user ID
        const user = userCredential.user;

        // Log sign-in data in DB
        // 'update' will only add the last_login info and won't overwrite anything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        })
        .then(() => {
            // User signed in:
            alert('User signed in succesfully!'); 

            // Get snapshot of all the user info and pass it to the
            // login() function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()) {
                    //console.log(snapshot.val());
                    logIn(snapshot.val(), firebaseConfig);
                } else {
                    console.log("User does not exist.");
                }
            })
            .catch((error) => {
                console.log(error);
            }
            )


        })
        .catch((error) => {
            // Sign-in failed
            alert(error);

        })
        })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });

    }


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user, fbcfg){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;
    // Session storage is temporary (only active while browser open)
    // Information saved as long as a string (must convert JS object)
    // Session storage will be cleared with a signOut() function in home.js
    fbcfg['userID'] = user.uid
    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));
        console.log('1');
        fetch('/test', {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(fbcfg),
        })
        console.log('2');
        window.location = '/home'; // Browser redirect to the home page
        console.log('3');
    }


    // Local storage is permanent (unless you signOut)
    else{
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));

        // Send Firebase configuration and unique user ID to app.py using POST method
        fetch('/test', {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(fbcfg),
        })
        window.location = '/home'; // Browser redirect to the home page
    }
}
