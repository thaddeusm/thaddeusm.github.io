var simpleSearch = {
	keyword: '',
	lyrics: false,
	stream: false,
	findLyrics: function() {
		var baseUrl =  'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=processSearch&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c&q_track_artist=';

		var url = baseUrl + this.keyword;

		// uses JSONP to avoid cross-domain issues in the browser
		var script = document.createElement('script');
		script.setAttribute('src', url);
		var body = document.querySelector('body');
		body.appendChild(script);
	},
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

var controller = {
	startSearch: function() {

		var keyword = document.getElementById('simpleSearchInput').value;
		console.log(keyword);

		simpleSearch.keyword = keyword;
		simpleSearch.findLyrics();
		simpleSearch.findStream();

		setTimeout(function() {
			document.getElementById('simpleSearchInput').value = ' ';
			view.resetIcon('.soundcloud-logo');
			view.resetIcon('.musixmatch-logo');
		}, 3000);
	},
	listener: function() {
		var input = document.getElementById('simpleSearchInput');

		input.addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				controller.startSearch();
			}
		});
	}
};

var view = {
	// requirement 4 - jQuery method
	changeIcon: function(icon) {
		$(icon).removeClass('dim').addClass('strong');
	},
	resetIcon: function(icon) {
		$(icon).removeClass('strong').addClass('dim');
	}
};

function processSearch(data) {
	console.log(data);

	var tracks = data.message.body.track_list;

	if (tracks.length > 0) {
		view.changeIcon('.musixmatch-logo');
	}
}

controller.listener();