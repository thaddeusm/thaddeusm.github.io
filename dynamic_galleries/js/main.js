/* 

This is a MVC application that meets project requirements by:
- responding to user interactions with an AJAX call to the Flickr API
- dynamically updating the page with content from Flickr
- implementing a lightbox effect on all thumbnails

*/

// model layer for the application
var gallery = {
	images: [],
	// pool of search terms for use in random keyword calls
	randomSearchTerms: [
		'pizzas',
		'fires',
		'trees',
		'unicorns',
		'clocks',
		'ducks',
		'computers',
		'beards',
		'lizards',
		'guitars',
		'houses',
		'flags'
	],
	// uses JavaScript's Math.random() function to choose a random keyword
	searchRandom: function() {
		var randomNumber = Math.floor(Math.random() * this.randomSearchTerms.length);
		this.searchWithKeyword(this.randomSearchTerms[randomNumber]);
		view.displayKeyword(this.randomSearchTerms[randomNumber]);
	},
	// processes a user's provided keyword
	searchWithKeyword: function(keyword) {
		var baseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3542b6ec7dddcef2f2894e464453b984&format=json&nojsoncallback=1';
		var option = '&text=';
		var searchItem = keyword.split(' ').join('%20');
		var term = option + searchItem;
		var url = baseUrl + term;

		view.displayKeyword(keyword);

		this.apiRequest(url);
	},
	// initiates a request to the Flickr API
	apiRequest: function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.send();
		request.addEventListener('load', this.receiveImagePool);
	},
	// processes the response from Flickr with basic error handling
	receiveImagePool: function(e) {
		var response = e.target.response;
		var jsonData = JSON.parse(response);

		var photoPool = jsonData.photos.photo;

		if (photoPool.length < 1) {
			alert('Sorry, we could not find any images.');
		} else {
			for (var i=0; i<5; i++) {
				gallery.buildUrl(photoPool[i]);
			}
		view.printThumbnails();	
		}
	},
	// creates a URL to the original thumbnail image per Flickr API documentation
	buildUrl: function(photo) {

		var farm = photo.farm;
		var server = photo.server;
		var photoId = photo.id;
		var secret = photo.secret;
		var alt = photo.title;

		var photoUrl = 'https://farm' + farm + '.staticflickr.com/' + server + '/' + photoId + '_' + secret + '_n.jpg';

		this.images.push({
			'alt': alt,
			'src': photoUrl
		});

	}
};

// controller layer handles interactions from the user
var controller = {
	startRandom: function() {
		gallery.images = [];
		view.emptyElement('#gallery');
		gallery.searchRandom();
	},
	promptKeyword: function() {
		view.hideElement('#dropdownContent');
		view.displayElement('#galleryBuilder');
		document.querySelector('input').focus();
	},
	startKeywordSearch: function() {
		var input = document.querySelector('input').value;

		if (input != '') {
			gallery.images = [];
			view.emptyElement('#gallery');
			gallery.searchWithKeyword(input);
			view.hideElement('#galleryBuilder');
			view.displayElement('#dropdown');
			view.emptyValue();
		} else {
			view.notifyError();
		}
	},
	startListeners: function() {
		var create = document.getElementById('create');

		create.addEventListener('click', function() {
			view.displayElement('#dropdownContent');
		});

		window.addEventListener('click', function(e) {
			if (e.target.id != 'create' && e.target.id != 'searchButton' && e.target.id != 'randomButton') {
				view.hideElement('#dropdownContent');
			}

			if (e.target.id == 'lightbox') {
				view.emptyElement('#centeredImage');
				view.hideElement('#lightbox');
				view.displayElement('.container');
			}
		});

		document.getElementById('close').addEventListener('click', function() {
			view.emptyElement('#centeredImage');
			view.hideElement('#lightbox');
			view.displayElement('.container');
		});

		create.addEventListener('mouseover', function() {
			view.displayElement('#dropdownContent');
		});

		document.getElementById('gallery').addEventListener('click', function(e) {
			if (e.target.className == 'thumbnail') {
				view.displayLightbox(e.target);
			}
		});

		document.querySelector('input').addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				controller.startKeywordSearch();
			}
		});
	},
	reloadPage: function() {
		location.reload(true);
	}
};

// view layer handles visual feedback
var view = {
	displayElement: function(element) {
		document.querySelector(element).style.display = 'block';
	},
	hideElement: function(element) {
		document.querySelector(element).style.display = 'none';
	},
	emptyElement: function(element) {
		document.querySelector(element).innerHTML = ' ';
	},
	emptyValue: function() {
		document.querySelector('input').value = '';
	},
	printThumbnails: function() {
		var galleryArea = document.getElementById('gallery');

		for (var i=0; i<gallery.images.length; i++) {
			var image = this.buildImage(gallery.images[i]);
			var caption = this.buildCaption(gallery.images[i]);
			galleryArea.appendChild(image);
			galleryArea.appendChild(caption);
		}
	},
	buildImage: function(item) {
		var image = document.createElement('img');
		image.setAttribute('src', item['src']);
		image.setAttribute('alt', item['alt']);
		image.setAttribute('class', 'thumbnail');

		return image;
	},
	buildCaption: function(item) {
		var caption = document.createElement('p');
		var link = document.createElement('a');
		link.setAttribute('href', item['src']);
		link.setAttribute('target', '_blank');
		console.log(item['alt']);
		if (item['alt'].length < 2) {
			link.innerHTML = 'Source';
		} else {
			link.innerHTML = item['alt'];
		}
		caption.appendChild(link);

		return caption;
	},
	// gives visual feedback if input is blank
	notifyError: function() {
		document.querySelector('input').style.borderBottom = '2px solid #FC575E';
	},
	// handles lightbox view
	displayLightbox: function(sourceImage) {
		var image = sourceImage.cloneNode();

		var lightbox = document.getElementById('lightbox');
		var centeredImage = document.getElementById('centeredImage');
		var caption = document.getElementById('caption');
		image.removeAttribute('class');
		var url = image.getAttribute('src');
		var arr = url.split('');
		arr[arr.length - 5] = 'z';
		var newUrl = arr.join('');
		image.setAttribute('src', newUrl);

		centeredImage.appendChild(image);
		this.hideElement('.container');
		lightbox.style.display = 'grid';
	},
	// ensures that keyword displayed is in a plural form
	displayKeyword: function(keyword) {
		if (keyword[keyword.length - 1] != 's') {
			keyword += '(s)';
		}

		document.getElementById('keyword').innerHTML = keyword;
	}
};

controller.startListeners();
gallery.searchRandom();
