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
		aside.style.display = 'none';
	},
	showMenu: function() {
		var aside = document.querySelector('aside');
		aside.style.display = 'block';
	},
	checkScreenWidth: function() {
		var body = document.querySelector('body');
	    var width = body.offsetWidth;
	    
	    if (width > 1201) {
	    	this.showMenu();
	    } else {
	    	this.hideMenu();
	    }
	}
};