var container = document.getElementById("container");
var aside = document.querySelector("aside");

var handler = {
	showNavigation: function() {
		aside.style.display = "block";
		container.style.display = "none";
	},
	hideNavigation: function() {
		aside.style.display = "none";
		container.style.display = "grid";
	}
};