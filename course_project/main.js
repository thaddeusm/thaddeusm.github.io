// musixmatch key d91e6ac977972cb40004b439e314009c

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

		if (this.iconDisplay == true) {
			this.showMenu();
		} else {
			this.hideMenu();
		}
	},
	hideMenu: function() {
		var aside = document.querySelector('aside');
		aside.classList = 'fade-out';
		aside.classList = 'slide-up';

		setTimeout(function() {
			aside.style.display = 'none';
		}, 600);
		
	},
	showMenu: function() {
		var aside = document.querySelector('aside');
		aside.classList = 'slide-down';
		aside.style.display = 'block';
	},
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




function getAspectRatio() {
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