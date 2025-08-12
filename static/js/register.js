// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: javascript associated with registering a new user's account in FireBase


// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
  
    import { getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
  
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

// ---------------- Register New Uswer --------------------------------//
document.getElementById('submitData').onclick = function(){
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPass').value;

  // Firebase will require a password of at least 6 characters
  const pass = document.getElementById('userPass').value;

  // Validate user inputs
  if(!validation(firstName, lastName, email, password)){
    return;
  }

  // Create user account
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // Add user account info to realtime database
    // 'Set' will create a new reference or completely replace an existing one
    // each new user will be placed under the 'users' node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    // save userID for home.js reference 
      email: email,
      //pasword: encryptPass(password),
      firstName: firstName,
      lastName: lastName
      })
      .then (() => {
        //Data saved successfully
        alert('User Created Successfully');
        const template_url = "/signIn";
        window.location = template_url;
      })
      .catch((error) => {
        alert(errorMessage)
      });
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
} 



// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  // let emailRegex = /^[a-zA-Z0-9_\-\.]+@ctemc\.org$/;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //Display alerts for invalid inputs
  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)){
    alert("Please complete all fields");
    return false;
  }

  if(!fNameRegex.test(firstName)){
    alert("First name must be letters only");
    return false;   
  }
  if(!lNameRegex.test(lastName)){
    alert("Last name must be letters only");
    return false;   
  }
  if(!emailRegex.test(email)){
    alert("Plase enter a valid email address");
    return false;   
  }
  return true;
}


// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}

function decryptPass(password){
  let decrypted = CryptoJS.AES.decrypt(password, password);
  return decrypted.toString();
}