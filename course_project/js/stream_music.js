var stream = {
	track: '',
	player: '',
	play: function() {
		// searching soundcloud for tracks related to coldplay
		SC.get('/tracks', {
			q: 'coldplay', license: 'cc-by-sa'
			// then, the first track is isolated
		}).then(function(tracks) {
			// grab track id and format for streaming
			// set the track to the property
			stream.track = '/tracks/' + tracks[0].id;
			
			// initializing the player from SDK
			SC.stream(stream.track).then(function(player) {
				// setting the player to a object prop
				stream.player = player;
				// playing the sound
				stream.player.play();
			}).catch(function(e) {
				console.log(e);
			});
			
		});
	},
	pause: function() {
		this.player.pause();
	},
	listener: function() {
		// requirement 4 - jQuery event
		$('#playButton').on('click', function() {
			stream.play();
		});
	}
};

stream.listener();