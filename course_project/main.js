// musixmatch key d91e6ac977972cb40004b439e314009c
// soundcloud id Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG

function process(data) {
	console.log(data);
}

var request = document.createElement('script');

request.setAttribute('src', 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=process&q_artist=iron%20and%20wine&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c');

document.querySelector('body').appendChild(request);


SC.initialize({
	client_id: 'Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG'
});

SC.get('/tracks', {
	q: 'iron and wine', license: 'cc-by-sa'
}).then(function(tracks) {
	console.log(tracks);
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
		$('aside').slideUp();

		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 500);
		
	},
	showMenu: function() {
		$('aside').slideDown();
		
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 500);
	},
	// requirement 3 - custom created function
	getAspectRatio: function() {
		var iframe = document.querySelector('iframe');
		var body = document.querySelector('body');

		var height = iframe.getAttribute('height');
		var width = iframe.getAttribute('width');
		var aspectRatio = height / width;

		var newWidth = body.offsetWidth;

		if (newWidth > 600) {
			var fixedWidth = 600;

			iframe.setAttribute('width', fixedWidth);
			iframe.setAttribute('height', fixedWidth * aspectRatio);
		} else {
			iframe.setAttribute('width', newWidth);
			iframe.setAttribute('height', newWidth * aspectRatio);
		}		
	}
};

ui.getAspectRatio();