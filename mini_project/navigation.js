// connect js to certain elements on the HTML

var container = document.getElementById('container');
var aside = document.querySelector('aside');

// create a few functions to hide/reveal the navigation

var handler = {
	showNavigation: function() {
		// hide the container
		container.style.display = "none";
		// reveal the aside
		aside.style.display = "block";
	},
	hideNavigation: function() {
		// reveal the container
		container.style.display = "grid";
		// hide the aside
		aside.style.display = "none";
	}
};