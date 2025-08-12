
// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: javascript associated with authors page

window.onload = function() {
    // Set initial displays  — do not display x buttons or descriptions but show blood drops
    document.getElementById('x-button-nidhi').style.display = "none";
    document.getElementById('x-button-varun').style.display = "none";
    document.getElementById('x-button-shravani').style.display = "none";
    document.getElementById('nidhi').style.display = "block";
    document.getElementById('varun').style.display = "block";
    document.getElementById('shravani').style.display = "block";
    document.getElementById('nidhi-desc').style.display = 'none';
    document.getElementById('varun-desc').style.display = 'none';
    document.getElementById('shravani-desc').style.display = 'none';


    // When blood drops are clicked, hide the blood drops and display the bio text
    document.getElementById('nidhi').onclick = function() {
        document.getElementById('x-button-nidhi').style.display = "block";
         document.getElementById('nidhi').style.display = "none";
         document.getElementById('nidhi-desc').style.display = "block";
     }
    document.getElementById('varun').onclick = function() {
            document.getElementById('x-button-varun').style.display = "block";
            document.getElementById('varun').style.display = "none";
            document.getElementById('varun-desc').style.display = "block";
        }
    document.getElementById('shravani').onclick = function(){
            document.getElementById('x-button-shravani').style.display = "block";
            document.getElementById('shravani').style.display = "none";
            document.getElementById('shravani-desc').style.display = "block";
        }
    
    // When x buttons are clicked, hide the bio text and reshow the blood drops
    document.getElementById('x-button-varun').onclick = function() {
        document.getElementById('varun').style.display = "block";
        document.getElementById('varun-desc').style.display = 'none';
        document.getElementById('x-button-varun').style.display = "none";
    }
    document.getElementById('x-button-nidhi').onclick = function() {
        document.getElementById('nidhi').style.display = "block";
        document.getElementById('nidhi-desc').style.display = 'none';
        document.getElementById('x-button-nidhi').style.display = "none";
    };

    document.getElementById('x-button-shravani').onclick = function() {
        document.getElementById('shravani').style.display = "block";
        document.getElementById('shravani-desc').style.display = 'none';
        document.getElementById('x-button-shravani').style.display = "none";
    }
};
