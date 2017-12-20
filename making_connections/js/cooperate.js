/*

Thaddeus McCleary
IS_LT 7356 - Interactive Web Design with JavaScript
Course Project

*/

// model object
var simpleSearch = {
	keyword: '',
	lyrics: false,
	stream: false,
	// AJAX - Musixmatch request
	findLyrics: function() {
		var baseUrl =  'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=processSearch&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c&q_track_artist=';

		var url = baseUrl + this.keyword;

		// uses JSONP to avoid cross-domain issues in the browser
		var script = document.createElement('script');
		script.setAttribute('src', url);
		var body = document.querySelector('body');
		// requirement 3 (b) - add an element to the website
		body.appendChild(script);
	},
	// AJAX - Soundcloud request
	findStream: function() {
		SC.get('/tracks', {
		  q: simpleSearch.keyword, license: 'cc-by-sa'
		}).then(function(tracks) {
		  console.log(tracks);
		  if (tracks.length > 0) {
		  	view.changeIcon('.soundcloud-logo');
		  }
		});
	}
};

// controller object
var controller = {
	// begins search on button click
	startSearch: function() {

		$('#simpleSearchButton').focus();

		var keyword = document.getElementById('simpleSearchInput').value;
		console.log(keyword);

		simpleSearch.keyword = keyword;
		simpleSearch.findLyrics();
		simpleSearch.findStream();

		// resets input field and feedback icons for multiple tries
		setTimeout(function() {
			document.getElementById('simpleSearchInput').value = ' ';
			view.resetIcon('.soundcloud-logo');
			view.resetIcon('.musixmatch-logo');
		}, 3000);
	},
	// sets up an event listener for the enter key when in the input field
	listener: function() {
		var input = document.getElementById('simpleSearchInput');

		input.addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				controller.startSearch();
			}
		});
	}
};

// view object to provide feedback to the user
var view = {
	// requirement 4 - jQuery method
	changeIcon: function(icon) {
		$(icon).removeClass('dim').addClass('strong');
	},
	resetIcon: function(icon) {
		$(icon).removeClass('strong').addClass('dim');
	}
};

// callback for Musixmatch request
function processSearch(data) {
	console.log(data);

	var tracks = data.message.body.track_list;

	if (tracks.length > 0) {
		view.changeIcon('.musixmatch-logo');
	}
}

controller.listener();