// Project Name: ThromboSense 
// Team Members: Nidhi Nair, Varun Gabbita, Shravani Vedagiri 
// Date: 5/31 
// Task: scrollanimations.js file used to display elements on scrolling

var rafId = null; // Request Animation Frame ID for controlling animation
var delay = 200; // Delay in milliseconds for revealing elements
var lTime = 0; // Last time the reveal function was called

function scroll() {
  var scrollTop = $(window).scrollTop(); // Current scroll position from the top of the page
  var height = $(window).height(); // Height of the viewport
  var visibleTop = scrollTop + height; // Bottom position of the viewport

  $('.reveal').each(function() {
    var $t = $(this);
    if ($t.hasClass('reveal_visible')) { return; } //check for elements with reveal class
    var top = $t.offset().top; // Top position of the element

    if (top <= visibleTop) { //check if the top of the element is below or at the visible portion of the screen
      if (top + $t.height() < scrollTop) {
        $t.removeClass('reveal_pending').addClass('reveal_visible'); //add class to make element visible
      } else {
        $t.addClass('reveal_pending'); // do not make element visible
        if (!rafId) requestAnimationFrame(reveal);  
      }
    }
  });
}

function reveal() {
  rafId = null; // Reset the Request Animation Frame ID
  
  var now = performance.now(); // Get the current timestamp
  
  if (now - lTime > delay) { // Check if enough time has passed since the last reveal
    lTime = now; // Update the last reveal time
    
    var $ts = $('.reveal_pending'); // Select all elements pending for reveal
    $($ts.get(0)).removeClass('reveal_pending').addClass('reveal_visible'); // Reveal the first pending element by removing the 'reveal_pending' class and adding the 'reveal_visible' class
  }
  
  if ($('.reveal_pending').length >= 1) // Check if there are still pending elements
    rafId = requestAnimationFrame(reveal); // Request the next animation frame to continue revealing elements
}


$(scroll); // Call scroll function on page load
$(window).scroll(scroll); // Call scroll function on window scroll event

$(window).click(function() {
  $('.reveal').removeClass('reveal_visible').removeClass('reveal_pending'); // Remove the 'reveal_visible' and 'reveal_pending' classes from all elements with class 'reveal'
  
  lTime = performance.now() + 500; // Set the value of lTime to the current timestamp plus 500 milliseconds
  
  var top = $(window).scrollTop(); // Get the current scroll position of the window
  $(window).scrollTop(top === 0 ? 1 : top-1); // Scroll the window slightly to trigger the reveal animation by adjusting the scroll position
});
