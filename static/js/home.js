// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: javascript associated with data collection, display, animation


// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getAuth, signOut} 
  from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
  
  import { getDatabase, ref, set, update, child, get, remove } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
  
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

// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('userLink');   // user name for number
let signOutLink = document.getElementById('signOut'); // sign-out link
let welcome = document .getElementById('welcome');    // welcome header
let currentUser = null;                               // initialize currentUser to null
let running = false; // for button


// ----------------------- Get User's Name'Name ------------------------------
function getUserName() {
  // Grab the value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
  // Grab uder information passed in from signIn.js
  if (keepLoggedIn == 'yes') {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

function signOutUser() {
  sessionStorage.removeItem('user'); // clear session storage
  localStorage.removeItem('user');   // clear local storage
  localStorage.removeItem('keepLoggedIn');

  signOut(auth, db).then(() => {
    // Sign-out successful.
    window.location.href = '/'; // redirect to index;
  }).catch((error) => {
    // An error happened.
    console.log(error);
  });
}
  



// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  // ---------------------------------- Set Welcome Message With User's Custom Name -------------------------
  getUserName();
  if(currentUser == null) {
    userLink.innerHTML = currentUser.name;
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "/register";

    signOutLink.innerHTML = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "/signIn";
  
  }
  else {
    //Add user initials to blood drop
    userLink.innerText = currentUser.firstName;
    userInit.innerText = currentUser.firstName[0] + "" + currentUser.lastName[0];
    // welcome.innerText = `Welcome ${currentUser.firstName}`;
    welcome.style.fontWeight = "900";
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    //Sign Out function addd to navbar region
    signOutLink.innerHTML = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success");
    document.getElementById('signOut').onclick = function(){
      signOutUser();
    }
    
  }
  //Set data loading animation and Warning Symbols to rmain hidden on load
  document.getElementById('animation').style.display = "none";
  document.getElementById('loading').style.display = 'none';
  document.getElementById('warning').style.display = 'none';
  // document.getElementById('warning').style.display = 'none';
  // document.getElementById('clear').style.display = 'none';
 
} 
  //Display data loading animation when the data collection button is clicked
  document.getElementById('dataCollection').onclick = function() {
    running = true;
    startLoop();
    document.getElementById('animation').style.display = "inline-block";
    document.getElementById('loading').style.display = 'inline-block';
   
  }
  //End Data Collection Button
  document.getElementById('endDataCollection').onclick = function() {
    //Remove data loaading animation
    document.getElementById('animation').style.display = "none";
    document.getElementById('loading').style.display = 'none';
    getDataSet(currentUser.uid);   // Automatically show the data graph
    fbcfg['userID'] = '';
    fetch('/test', {
      "method": "POST",
      "headers": { "Content-Type": "application/json" },
      "body": JSON.stringify(fbcfg),
  })
    
  }


  // ------------------------- Start Loop Function To Start Data Collection In FireBase -------------------------
function startLoop() {
  if (running == true) {
    const userID = currentUser.uid;
    get(ref(db, 'users/' + userID + '/accountInfo')).then((snapshot) => {
      if (snapshot.exists()) {
          //console.log(snapshot.val());
          collectData(snapshot.val(), firebaseConfig);
          alert('Data Collection Started.')
      }})
  }
  else {
    alert('Data Collection Stopped.');
}};


//Provide path to write data to firebase
function collectData(user, fbcfg){
    fbcfg['userID'] = user.uid
    fetch('/test', {
      "method": "POST",
      "headers": { "Content-Type": "application/json" },
      "body": JSON.stringify(fbcfg),
  })
}

async function getData(userID){
  const dbref = ref(db); // firbease paramter to get a reference to the database

  //Provide the path thrugh the nodes
  let data = await get(child(dbref , 'users/' + currentUser.uid + '/data/')).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  })
  .catch((error) => {
    alert("Unsuccessful, error" + error);
  });
  return data;
}

//Function to create chart
function createChart(keys, values) {
  const ctx = document.getElementById('blood-chart');
  ctx.style.display = 'block';
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: keys,
      datasets: [
        {
          label: 'Blood Flow Rate',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,                   // Re-size based on screen size
      scales: {                           // x & y axes display options
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Time (s)',
            font: {
              size: 20,
              family: 'Montserrat'
            },
          }
          },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Blood Flow Rate (cm/s)',
            font: {
              size: 20,
              family: 'Montserrat'
            },
          }
        }
      },
    }
  });
}


async function getDataSet(userID){
  const values = []; //y axis
  const keys = []; //x axis
  let time = '';
  const dbref = ref(db); // firbease paramter to get a reference to the database
  let sum = 0;
 
 
await get(child(dbref , 'users/' + userID + '/data/')).then((snapshot) => {
  if (snapshot.exists()) {
    let initData = snapshot.val();
    time = Object.keys(initData)[Object.keys(initData).length-1]; // get the latest time that data was recorded
    console.log(time);
  } else {
   alert('No Data Found');
  }}).catch((error) => {
    alert("Unsuccessful, error" + error);
  });
  await get(child(dbref , 'users/' + userID + '/data/' + time)).then((snapshot) => {
    let data = snapshot.val();
  
    //iterate through the data and push the values to an array which is used to create the chart
    for(let k = 0; k < data.length; k++){
    // Push every 5th data value
    if (data[k] != null){
    values.push(data[k]);
    keys.push(k);
    sum += parseInt(data[k]);
  } else {
  // In case the initial data is null, push the previous value to the array
    values.push(data[k-1]);
    keys.push(k-1);
  }
  }
  }).catch((error) => {
    alert("Unsuccessful, error" + error);});
  console.log(sum);
  console.log(values.length)
  let avg = (sum+3) / values.length;
  avg = avg.toFixed(2);
  //console.log(avg);
  createChart(keys, values);
  showAverage(avg);
  console.log('done');
  }
  
 //Calculate Average of All Data and Display color based on value being safe/dangerous
 function showAverage(average){
  let place = document.getElementById('average');
  place.innerHTML = 'Average: ' + average + " cm/s";
  place.style.fontSize = '40px';
  place.style.fontFamily = 'Montserrat';
  place.style.color = 'red';
  place.style.fontWeight = 'bold';
  let warning = document.getElementById('warning');
  if (average < 20){
  place.style.color = 'red';
  //Display icon image corresponding to results
  // document.getElementById('warning').style.display = 'inline-block';
  warning.style.display = 'inline-block';
  warning.classList.add("bad");
  document.getElementById("message").innerHTML = "What Your Results Mean: Your bloodflow velocity is under the normal range! You may be at SERIOUS risk of developing a DVT or may already have a blood clot. Contact a healthcare professional immediately."
  } else {
  place.style.color = 'green';
  //Display icon image corresponding to results
  // document.getElementById('clear').style.display = 'inline-block';
  warning.style.display = 'inline-block';
  warning.classList.add("clear");
  document.getElementById("message").innerHTML = "What Your Results Mean: Your bloodflow velocity is within the normal range! At the moment, you do not display risk of a DVT."
  } 
  place.style.fontWeight = 'bold';
 
 }