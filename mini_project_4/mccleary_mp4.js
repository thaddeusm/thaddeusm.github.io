var iframe = document.querySelector('iframe');
var body = document.querySelector('body');

function getAspectRatio() {
	var height = iframe.getAttribute('height');
	var width = iframe.getAttribute('width');
	var aspectRatio = height / width;

	var newWidth = body.offsetWidth;

	if (newWidth > 600) {
		var fixedWidth = 600;

		iframe.setAttribute('width', fixedWidth);
		iframe.setAttribute('height', fixedWidth * aspectRatio);
	} else {
		iframe.setAttribute('width', newWidth);
		iframe.setAttribute('height', newWidth * aspectRatio);
	}
}


var galleryMain = document.getElementById('galleryMain');
var ul = document.querySelector('ul');

var gallery = {
	images: [
		{
			source: 'media/fire1.jpg',
			alt: 'Flame 1'
		},
		{
			source: 'media/fire2.jpg',
			alt: 'Flame 2'
		},
		{
			source: 'media/fire3.jpg',
			alt: 'Flame 3'
		}
	],
	currentIndex: 0,
	setCurrentImage: function(index) {
		this.currentIndex = index;
	}
};

var controller = {
	replaceImage: function(index) {
		view.enableButton(gallery.currentIndex);
		view.replaceImage(index);
		gallery.setCurrentImage(index);
		view.disableButton(index);
	}
};

var view = {
	setMainImage: function() {
		galleryMain.appendChild(this.imageConstructor({ param1: gallery.images[0] }));
		galleryMain.appendChild(this.setCaption(0));
	},
	setThumbnails: function() {
		for (var i=0; i<gallery.images.length; i++) {
			ul.appendChild(this.imageConstructor({ param1: gallery.images[i], param2: i }));
		}
	},
	imageConstructor: function(options) {
		var newImage = document.createElement('img');
		newImage.setAttribute('alt', options.param1.alt);
		newImage.setAttribute('src', options.param1.source);

		if (options.param2 != undefined) {
			var listItem = document.createElement('li');
			var button = document.createElement('button');
			button.setAttribute('type', 'button');
			var onclick = 'controller.replaceImage(' + options.param2 + ')';
			button.setAttribute('onclick', onclick);
			button.setAttribute('id', options.param2);
			button.appendChild(newImage);
			listItem.appendChild(button);
			return listItem;
		} else {
			return newImage;
		}
	},
	replaceImage: function(index) {
		var oldImage = document.querySelectorAll('#galleryMain > img');
		oldImage[0].setAttribute('class', 'fade-out');

		var scope = this;
		setTimeout(function() {
			galleryMain.innerHTML = '';
			var newImage = scope.imageConstructor({ param1: gallery.images[index] });
			var newCaption = scope.setCaption(index);
			newImage.setAttribute('class', 'fade-in');
			galleryMain.appendChild(newImage);
			galleryMain.appendChild(newCaption);
		}, 200, scope);
	},
	setCaption: function(index) {
		var caption = document.createElement('p');
		var anchor = document.createElement('a');

		anchor.setAttribute('href', gallery.images[index].source);
		anchor.setAttribute('target', '_blank');
		anchor.innerHTML = "from StockSnap.io";
		caption.appendChild(anchor);
		return caption;
	},
	disableButton: function(index) {
		var button = document.getElementById(index);
		button.setAttribute('disabled', 'true');
	},
	enableButton: function(index) {
		var button = document.getElementById(index);
		button.removeAttribute('disabled');
	}
};

view.setMainImage();
view.setThumbnails();
view.disableButton(gallery.currentIndex);
