var gallery = {
	images: [],
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
	searchRandom: function() {
		var randomNumber = Math.floor(Math.random() * this.randomSearchTerms.length);
		this.searchWithKeyword(this.randomSearchTerms[randomNumber]);
		view.displayKeyword(this.randomSearchTerms[randomNumber]);
	},
	searchWithKeyword: function(keyword) {
		var baseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3542b6ec7dddcef2f2894e464453b984&format=json&nojsoncallback=1';
		var option = '&text=';
		var searchItem = keyword.split(' ').join('%20');
		var term = option + searchItem;
		var url = baseUrl + term;

		view.displayKeyword(keyword);

		this.apiRequest(url);
	},
	apiRequest: function(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.send();
		request.addEventListener('load', this.receiveImagePool);
	},
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

		document.getElementById('lightbox').addEventListener('touchstart', function() {
			if (e.target.id == 'lightbox') {
				view.emptyElement('#centeredImage');
				view.hideElement('#lightbox');
				view.displayElement('.container');
			}
		});

		create.addEventListener('mouseover', function() {
			view.displayElement('#dropdownContent');
		});

		document.getElementById('gallery').addEventListener('click', function(e) {
			if (e.target.className == 'thumbnail') {
				view.displayLightbox(e.target);
			}
		});
	},
	reloadPage: function() {
		location.reload(true);
	}
};

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

			galleryArea.appendChild(image);
		}
	},
	buildImage: function(item) {
		var image = document.createElement('img');
		image.setAttribute('src', item['src']);
		image.setAttribute('alt', item['alt']);
		image.setAttribute('class', 'thumbnail');

		return image;
	},
	notifyError: function() {
		document.querySelector('input').style.borderBottom = '2px solid #FC575E';
	},
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
	displayKeyword: function(keyword) {
		if (keyword[keyword.length - 1] != 's') {
			keyword += '(s)';
		}

		document.getElementById('keyword').innerHTML = keyword;
	}
};

controller.startListeners();
gallery.searchRandom();
