/*

Thaddeus McCleary
IS_LT 7356 - Interactive Web Design with JavaScript
Course Project

*/

// object with view properties and methods
var ui = {
	// controls state of mobile navigation menu
	iconDisplay: false,
	toggleMenu: function() {

		this.iconDisplay = !this.iconDisplay;

		// requirement 3 - if statement
		if (this.iconDisplay == true) {
			this.showMenu();
		} else {
			this.hideMenu();
		}
	},
	// slide effect for mobile navigation menu
	hideMenu: function() {
		// requirement 4 - jQuery animation
		$('aside').slideUp(400, function() {
			$('html,body').animate({
            	scrollTop: $(this).offset().top
       		}, 'slow');
		});
		
	},
	showMenu: function() {
		$('aside').slideDown();
	},
	// requirement 3 - custom created function
	getIdealWidth() {
		var body = document.querySelector('body');

		var pre = document.querySelectorAll('pre');
		var iframe = document.querySelector('iframe');
		
		// modifies the width of pre elements for better user experience
		if (pre) {
			var newWidth = body.offsetWidth;
			var fixedWidth = 850;

			// requirement 3 - loop
			for (var i=0; i<pre.length; i++) {
				if (newWidth > 1268) {
					pre[i].style.width = '' + fixedWidth + 'px';
				} else {
					pre[i].style.width = '' + newWidth + 'px';
				}
			}
		}

		// modifies the size of iframe elements (Youtube) for better user experience
		if (iframe) {

			var height = iframe.getAttribute('height');
			var width = iframe.getAttribute('width');
			var aspectRatio = height / width;

			var newWidth = body.offsetWidth - 10;

			if (newWidth > 1268) {
				var fixedWidth = 850;

				iframe.setAttribute('width', fixedWidth);
				iframe.setAttribute('height', fixedWidth * aspectRatio);
			} else {
				iframe.setAttribute('width', newWidth);
				iframe.setAttribute('height', newWidth * aspectRatio);
			}
		}

	}
};

// requirement for the Soundcloud SDK
SC.initialize({
	client_id: 'Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG'
});

// sets ideal width for pre and iframe elements on page load
ui.getIdealWidth();