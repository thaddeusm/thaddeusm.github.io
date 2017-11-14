// musixmatch key d91e6ac977972cb40004b439e314009c

function process(data) {
	console.log(data);
}

var request = document.createElement('script');

request.setAttribute('src', 'https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=process&q_artist=iron%20and%20wine&quorum_factor=1&apikey=d91e6ac977972cb40004b439e314009c');

document.querySelector('body').appendChild(request);