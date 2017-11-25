var key = 'd91e6ac977972cb40004b439e314009c';

// object that contains methods and properties for accessing and displaying lyrics
var lyrics = {
	// array to hold lyric data from Musixmatch
	tracks: [],
	// iterator to constrain the second API requests for lyrics
	count: 0,
	// the first API call to find IDs for tracks by Coldplay
	search: function() {
		var url = 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&q_artist=coldplay&callback=processSearch&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c';

		// uses JSONP to avoid cross-domain issues in the browser
		var script = document.createElement('script');
		script.setAttribute('src', url);
		var body = document.querySelector('body');
		body.appendChild(script);
	},
	// builds a new local data structure from the API response
	processData: function(data) {
		var arr = data.message.body.track_list;

		for (var i=0; i<arr.length; i++) {
			if (arr[i].track.has_lyrics == 1) {
				this.tracks.push({
					'id': arr[i].track.track_id,
					'title': arr[i].track.track_name,
					// lyrics will be added to each object in a second call
					'lyrics': ''
				});
			}
		}

		this.findLyrics();
		
	},
	// the second API call that uses previously acquired IDs to find lyrics
	findLyrics: function() {
		var baseUrl = 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=processLyricsRequest&apikey=d91e6ac977972cb40004b439e314009c&track_id=';

		for (var i=0; i<this.tracks.length; i++) {
			var url = baseUrl + this.tracks[i]['id'];

			var script = document.createElement('script');
			script.setAttribute('src', url);
			var body = document.querySelector('body');
			body.appendChild(script);
		}

	},
	// a DOM element constructor with a single purpose
	buildElement: function(element, content) {
		var newElement = document.createElement(element);
		newElement.innerHTML = content;

		return newElement;
	},
	// populates the accordion with song titles and lyrics
	fillAccordion: function() {
		var accordion = document.getElementById('accordion');

		for (var i=0; i<this.tracks.length; i++) {
			var title = this.buildElement('h2', this.tracks[i]['title']);
			var lyricsText = this.buildElement('div', this.tracks[i]['lyrics']);
			accordion.appendChild(title);
			accordion.appendChild(lyricsText);
		}

		this.initializeAccordion();
	},
	// requirement 5 - one jQuery UI widget
	initializeAccordion: function() {
		// initializes the widget to create the accordion effect
		$('#accordion').accordion();
	},
	// requirement 4 - jQuery event
	listener: function() {
		$('#loadLyricsButton').on('click', function() {
			lyrics.search();
		});
	}
};

// listener starts after page loads
lyrics.listener();

// the callback for the first API request for track IDs
function processSearch(data) {
	lyrics.processData(data);
}

// the callback for the second API request for lyrics
function processLyricsRequest(lyricData) {
	var rawLyrics = lyricData.message.body.lyrics.lyrics_body;
	// removes carriage returns from the string and replaces them with line breaks
	var formattedLyrics = rawLyrics.replace(/[\n\r]/g, '<br>');
	// removes the final disclaimer for cleaner formatting
	var prettyLyrics = formattedLyrics.split('******* Thi');

	// the array created by the string.split() method is used to isolate the lyrics
	lyrics.tracks[lyrics.count]['lyrics'] = prettyLyrics[0];
	// the custom iterator is controlled to ensure that the accordion is populated
	// only after the tracks array has been filled with lyrics for each track
	lyrics.count++;

	if (lyrics.count == 10) {
		console.log(lyrics.tracks);
		lyrics.fillAccordion();
	}
}