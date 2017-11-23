// musixmatch key d91e6ac977972cb40004b439e314009c
// soundcloud id Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG

// function process(data) {
// 	console.log(data);
// }

// var request = document.createElement('script');

// request.setAttribute('src', 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=process&q_artist=iron%20and%20wine&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c');

// document.querySelector('body').appendChild(request);


SC.initialize({
	client_id: 'Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG'
});


var ui = {
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
		var iframes = document.querySelectorAll('iframe');
		
		if (pre) {
			var newWidth = body.offsetWidth;
			var fixedWidth = 700;

			// requirement 3 - loop
			for (var i=0; i<pre.length; i++) {
				if (newWidth > 1268) {
					pre[i].style.width = '' + fixedWidth + 'px';
				} else {
					pre[i].style.width = '' + newWidth + 'px';
				}
			}
		}

		if (iframes) {
			var iframe = document.querySelector('iframe');

			var height = iframe.getAttribute('height');
			var width = iframe.getAttribute('width');
			var aspectRatio = height / width;

			var newWidth = body.offsetWidth;

			if (newWidth > 1268) {
				var fixedWidth = 700;

				iframe.setAttribute('width', fixedWidth);
				iframe.setAttribute('height', fixedWidth * aspectRatio);
			} else {
				iframe.setAttribute('width', newWidth);
				iframe.setAttribute('height', newWidth * aspectRatio);
			}
		}

	}
};

ui.getIdealWidth();
