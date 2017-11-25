var stream = {
	track: '',
	player: '',
	findSound: function() {
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
				stream.player = window.player = player;
			}).catch(function(e) {
				console.log(e);
			});
			
		});
	},
	play: function() {
		// play the sound
		this.player.play();
	},
	pause: function() {
		this.player.pause();
	}
};

stream.findSound();