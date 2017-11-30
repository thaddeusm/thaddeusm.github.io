var musicPlayer = {
	playlist: [],
	lyricResults: [],
	streamResults: [],
	audioPlayer: '',
	currentTrack: null,
	searchTerm: '',
	hasLyrics: false,
	hasStream: false,
	count: 0,
	findStream: function() {
		SC.get('/tracks', {
			q: this.searchTerm
		}).then(function(tracks) {
			musicPlayer.processStreams(tracks);
		});
	},
	findLyrics: function() {
		var baseUrl =  'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=processLyricsSearch&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c&q_track_artist=';

		var url = baseUrl + this.searchTerm;

		// uses JSONP to avoid cross-domain issues in the browser
		var script = document.createElement('script');
		script.setAttribute('src', url);
		var body = document.querySelector('body');
		body.appendChild(script);
	},
	processLyrics: function(data) {
		var arr = data.message.body.track_list;
		if (arr.length > 0) {
			this.hasLyrics = !this.hasLyrics;
			for (let i=0; i<arr.length; i++) {
				if (arr[i].track.has_lyrics == 1) {
					this.lyricResults.push({
						'type': 'lyrics',
						'id': arr[i].track.track_id,
						'title': arr[i].track.track_name,
						'artist': arr[i].track.artist_name,
						'url': arr[i].track.track_share_url,
						// lyrics will be added to each object in a second call
						'lyrics': ''
					});
				}
			}
		}
		this.getLyricText();
	},
	getLyricText: function() {
		var baseUrl = 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=fillInLyrics&apikey=d91e6ac977972cb40004b439e314009c&track_id=';

		for (var i=0; i<this.lyricResults.length; i++) {
			var url = baseUrl + this.lyricResults[i]['id'];

			var script = document.createElement('script');
			script.setAttribute('src', url);
			var body = document.querySelector('body');
			body.appendChild(script);
		}
	},
	processStreams: function(data) {
		if (data.length > 0) {
			this.hasStream = !this.hasStream;
			for (let i=0; i<data.length; i++) {
				this.streamResults.push({
					'type': 'stream',
					'id': data[i].id,
					'title': data[i].title,
					'art': data[i].artwork_url,
					'url': data[i].permalink_url,
					'waveform': data[i].waveform_url
				});
			}
		}

		if (this.hasStream == true && this.hasLyrics == true) {
			this.filterData();
		} else {
			this.resetProperties();
		}
	},
	filterData: function() {
		var options = [];

		for (let i=0; i<this.lyricResults.length; i++) {
			let track = this.lyricResults[i]['title'];
			for (let j=0; j<this.streamResults.length; j++) {
				let trackTwo = this.streamResults[j]['title'];
				if (trackTwo.search(track) != -1) {
					options.push([this.lyricResults[i], this.streamResults[j]]);
					break;
				}
			}
		}

		this.playlist.push(options[0]);

		this.resetProperties();

		if (this.playlist[0][0]) {
			controller.updatePlayer();
		}
		
	},
	shiftTracks: function() {
		if (arguments[0]) {
			this.currentTrack = this.playlist.splice(arguments[0], 1);
		} else {
			this.currentTrack = this.playlist.splice(0, 1);
		}
		view.clearPlayer();
		view.populatePlayer();
		view.updatePlaylist();
		view.displayLyrics();
		view.changeFocus('#searchTermInput');

		var track = '/tracks/' + this.currentTrack[0][1]['id'];

		SC.stream(track).then(function(player) {
			musicPlayer.audioPlayer = player;
		}).catch(function(e) {
			console.log(e);
		});
	},
	deleteTrack: function() {

	},
	resetProperties: function() {
		this.count = 0;
		this.lyricResults = [];
		this.streamResults = [];
		this.hasLyrics = false;
		this.hasStream = false;
		this.searchTerm = '';
	}
};

var controller = {
	isCollapsed: false,
	startSearch: function() {
		var input = document.querySelector('input').value;

		if (input.length > 1) {
			musicPlayer.searchTerm = input;
			musicPlayer.findLyrics();

			document.querySelector('input').value = ' ';

		} else {
			view.changeFocus('#searchTermInput');
		}
	},
	startListeners: function() {
		var input = document.querySelector('input');
		input.addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				controller.startSearch();
				view.changeFocus('#searchTermInput');
			}
		});
	},
	startPlaylistListener: function() {
		musicPlayer.audioPlayer.on('finish', function() {
			if (musicPlayer.playlist.length > 0) {
				musicPlayer.shiftTracks();
				
				setTimeout(function() {
					controller.play();
				}, 2000);
			}
		});
	},
	toggleMenu: function() {
		if (this.isCollapsed == false) {
			view.showPlaylist();
		} else {
			view.hidePlaylist();
		}

		this.isCollapsed = !this.isCollapsed;
	},
	newSearch: function() {
		view.hideElement('#player');
		view.showElement('#searchArea');
		view.changeFocus('#searchTermInput');
	},
	updatePlayer: function() {
		view.brightenIcons();

		setTimeout(function() {
			if (musicPlayer.currentTrack == null) {
				musicPlayer.shiftTracks();
			} else {
				view.updatePlaylist();

				if (document.querySelector('body').offsetWidth < 801) {
					view.hideElement('#searchArea');
					view.showElement('#player', 'grid');
				}
			}
		}, 1500);
	},
	shiftTracks: function(index) {
		musicPlayer.shiftTracks(index);
		this.pause();
		view.changeFocus('#searchTermInput');

		setTimeout(function() {
			controller.play();
		}, 1000);
	},
	play: function() {
		musicPlayer.audioPlayer.play();
		this.startPlaylistListener();
	},
	pause: function() {
		musicPlayer.audioPlayer.pause();
	}
};

var view = {
	brightenIcons: function() {
		var soundcloud = document.getElementById('soundcloud');
		var musixmatch = document.getElementById('musixmatch');

		soundcloud.style.opacity = '1';
		musixmatch.style.opacity = '1';

		setTimeout(function() {
			view.dimIcon(soundcloud);
			view.dimIcon(musixmatch);
		}, 1200);
		
	},
	dimIcon: function(icon) {
		icon.style.opacity = '.3';
	},
	hideElement: function(element) {
		document.querySelector(element).style.display = 'none';
	},
	showElement: function(element) {
		if (arguments[1]) {
			document.querySelector(element).style.display = 'grid';
		} else {
			document.querySelector(element).style.display = 'block';
		}
	},
	buildImage: function(source, alt) {
		if (source == undefined) {
			source = 'media/generic_image.png';
			alt = 'Piano';
		}

		var newImage = document.createElement('img');
		newImage.setAttribute('src', source);
		newImage.setAttribute('alt', alt);
		return newImage;
	},
	buildContentElement: function(element, content) {
		var newElement = document.createElement(element);
		newElement.innerHTML = content;

		if (arguments[2]) {
			newElement.setAttribute('onclick', arguments[2]);
		}

		return newElement;
	},
	populatePlayer: function() {
		this.clearPlayer();
		var coverArt = document.getElementById('coverArt');
		var songTitle = document.getElementById('songTitle');
		songTitle.innerHTML = musicPlayer.currentTrack[0][0]['title'];
		coverArt.appendChild(
			this.buildImage(musicPlayer.currentTrack[0][1]['art']),
							musicPlayer.currentTrack[0][1]['title']
			);

		if (document.querySelector('body').offsetWidth < 801) {
			this.hideElement('#searchArea');
			this.showElement('#player', 'grid');	
		}
	},
	clearPlayer: function() {
		var coverArt = document.getElementById('coverArt');
		var songTitle = document.getElementById('songTitle');
		songTitle.innerHTML = '';
		coverArt.innerHTML = '';
	},
	hidePlaylist: function() {
		$('#playlist').slideUp(400, function() {
			$('html,body').animate({
            	scrollTop: $(this).offset().top
       		}, 'slow');
		});
		
	},
	showPlaylist: function() {
		$('#playlist').slideDown();
	},
	updatePlaylist: function() {
		var playlistArea = document.getElementById('tracks');

		playlistArea.innerHTML = '';

		for (var i=0; i<musicPlayer.playlist.length; i++) {
			var title = musicPlayer.playlist[i][0]['title'];
			var span = this.buildContentElement('span', title);
			var onclick = 'controller.shiftTracks(' + i + ')';
			var button = this.buildContentElement('button', '', onclick);
			button.appendChild(span);
			playlistArea.appendChild(button);
		}
	},
	displayLyrics: function() {
		var lyricsArea = document.getElementById('lyrics');

		lyricsArea.innerHTML = '';

		var thisTrack = musicPlayer.currentTrack[0][0];
		var waveformSource = musicPlayer.currentTrack[0][1]['waveform'];
		lyricsArea.style.backgroundImage = 'url(' + waveformSource + ')';

		var h2 = this.buildContentElement('h2', thisTrack['title']);
		var h5 = this.buildContentElement('h5', thisTrack['artist']);
		var p = this.buildContentElement('p', thisTrack['lyrics']);
		
		var a = this.buildContentElement('a', 'read more on Musixmatch');
		a.setAttribute('href', thisTrack['url']);
		a.setAttribute('target', '_blank');


		lyricsArea.appendChild(h2);
		lyricsArea.appendChild(h5);
		lyricsArea.appendChild(p);
		lyricsArea.appendChild(a);
	},
	changeFocus: function(element) {
		$(element).focus();
	}
};

SC.initialize({
	client_id: 'Ka5PHrXNLn7Hf0LUAOovYYsMVKyCGQwG'
});

controller.startListeners();
view.changeFocus('#searchTermInput');

function processLyricsSearch(data) {
	musicPlayer.processLyrics(data);
}

function fillInLyrics(data) {
	var rawLyrics = data.message.body.lyrics.lyrics_body;
	// removes carriage returns from the string and replaces them with line breaks
	var formattedLyrics = rawLyrics.replace(/[\n\r]/g, '<br><br>');
	// removes the final disclaimer for cleaner formatting
	var prettyLyrics = formattedLyrics.split('******* Thi');

	// the array created by the string.split() method is used to isolate the lyrics
	musicPlayer.lyricResults[musicPlayer.count]['lyrics'] = prettyLyrics[0];
	// the custom iterator is controlled to ensure that the accordion is populated
	// only after the tracks array has been filled with lyrics for each track
	musicPlayer.count++;

	if (musicPlayer.count == musicPlayer.lyricResults.length) {
		musicPlayer.findStream();
	}
}