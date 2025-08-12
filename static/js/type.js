// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: type.js file, used for typing animation on index page


window.onload = function () { //run function as soon as window opens
// if (inView()){
    var typed = new Typed(".auto-type", {
        strings: [" Diagnosis.", " Comfort.", " Results.", " You!"],      // Strings to display
        typeSpeed: 65,    // Speed of typing                                
        backSpeed: 60,    // Speed of deleting
        startDelay: 800,  // Delay before typing starts
        loop: false,      // Do not loop
        
        //Remove cursor after 1 second once the typing animation is complete
        onComplete: (self) => {
            setTimeout(() => {
                self.cursor.remove();
            }, 1000);
        }
    });
};

