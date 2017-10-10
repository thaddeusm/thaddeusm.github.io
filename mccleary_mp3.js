var officials = {
	urlBase: 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyCD-IbsX7zkODgJDUtduyN1guGWUETdVdQ',
	images: true,
	buildURL: function(address, city, state, zip, national) {
		var formattedAddress = address.split(' ').join('%20');

		var space = '%20';
		var and = '&';

		var url = this.urlBase + and + 'address=' + formattedAddress + space + city + space + zip;

		if (national == true) {
			url += and + 'levels=country';	
		}

		this.getSenators(url);
		this.getReps(url);

	},
	getSenators: function(url) {
		var call = new XMLHttpRequest();

		url += '&roles=legislatorUpperBody';

		call.addEventListener('load', this.organizeSenators);
		call.open('GET', url);
		call.send();
	},
	getReps: function(url) {
		var call = new XMLHttpRequest();

		url += '&roles=legislatorLowerBody';

		call.addEventListener('load', this.organizeReps);
		call.open('GET', url);
		call.send();
	},
	organizeSenators: function() {
		var data = JSON.parse(this.responseText);

		console.log(data);
		var people = data.officials;
		var officesData = data.offices;

		var namesData = [];
		var imagesData = [];
		var socialData = [];
		var websitesData = [];
		var partyData = [];
		var offices = [];
		for (var i=0; i<people.length; i++) {
			if (people[i].name != null) {
				namesData.push(people[i].name);
			} else {
				namesData.push('none');
			}
			
			if (people[i].channels != null) {
				socialData.push(people[i].channels);
			} else {
				socialData.push('none');
			}

			if (people[i].party != null) {
				partyData.push(people[i].party)
			} else {
				partyData.push('none');
			}
			
			
			if (people[i].urls != null) {
				websitesData.push(people[i].urls[0]);
			} else {
				websitesData.push('none');
			}

			if (officials.images == true) {
				imagesData.push(people[i].photoUrl);
			} else {
				imagesData.push('none');
			}
		}

		if (officesData.length = 1) {
			offices = [officesData[0].name, officesData[0].name];
		} else {
			offices = [officesData[0].name, officesData[0].name, officesData[1].name];
		}

		var senators = {
			names: namesData,
			images: imagesData,
			social: socialData,
			websites: websitesData,
			titles: offices,
			parties: partyData
		};

		view.constructElements(senators);
	},
	organizeReps: function() {
		var data = JSON.parse(this.responseText);
		console.log(data);
		var people = data.officials;
		var officesData = data.offices;

		var namesData = [];
		var imagesData = [];
		var socialData = [];
		var websitesData = [];
		var offices = [];
		var partyData = [];
		for (var i=0; i<people.length; i++) {
			if (people[i].name != null) {
				namesData.push(people[i].name);
			} else {
				namesData.push('none');
			}

			if (people[i].party != null) {
				partyData.push(people[i].party)
			} else {
				partyData.push('none');
			}

			if (people[i].channels != null) {
				socialData.push(people[i].channels);
			} else {
				socialData.push('none');
			}

			if (people[i].urls != null) {
				websitesData.push(people[i].urls[0]);
			} else {
				websitesData.push('none');
			}

			if (officesData[i] != null) {
				offices.push(officesData[i].name);
			} else {
				offices.push(officesData[officesData.length-1].name);
			}
			
			if (officials.images == true) {
				imagesData.push(people[i].photoUrl);
			} else {
				imagesData.push('none');
			}
		}

		var reps = {
			names: namesData,
			images: imagesData,
			social: socialData,
			websites: websitesData,
			titles: offices,
			parties: partyData
		};

		setTimeout(function() {
			view.constructElements(reps);
		}, 600);

		view.displayOfficials();
	}
};

var controller = {
	openForm: function(e) {
		view.hide(e);
		view.reveal('form');
	},
	validate: function() {
		var address = document.getElementById('address');
		var city = document.getElementById('city');
		var zip = document.getElementById('zip');

		var array = [address, city, zip];
		var errors = 0;
		for (var i=0; i<array.length; i++) {
			view.restoreBorder(array[i]);
			if (array[i].value == '') {
				errors++;
				view.displayError(array[i]);
			}
		}

		if (errors == 0) {
			this.grabInputs();
		}
	},
	grabInputs: function() {
		var address = document.getElementById('address').value;
		var city = document.getElementById('city').value;
		var stateList = document.getElementById('stateList');
		var state = stateList[stateList.selectedIndex].value;
		var zip = document.getElementById('zip').value;
		var withoutImages = document.getElementById('withoutImages').checked;
		var national = document.getElementById('national').checked;

		if (withoutImages == true) {
			officials.images = false;
		}

		officials.buildURL(address, city, state, zip, national);

	}
};

var view = {
	hide: function(e) {
		document.querySelector(e).style.display = 'none';
	},
	reveal: function(e) {
		document.querySelector(e).style.display = 'block';
	},
	listeners: function() {
		document.getElementById('submit').addEventListener('click', function(e) {
			e.preventDefault();
		});
	},
	convertTitle: function() {
		var h1 = document.querySelector('h1');

		h1.addEventListener('click', function() {
			location.reload(true);
		});

		h1.style.cursor = 'pointer';
	},
	restoreBorder: function(element) {
		element.style.borderBottom = '2px solid #BDC3C7';
	},
	displayError: function(element) {
		element.style.borderBottom = '2px solid #EC644B';
	},
	displayOfficials(house) {
		this.hide('form');
		this.reveal('#officials');
		var section = document.getElementById('officials');
	},
	constructElements: function(house) {
		var section = document.getElementById('officials');
		console.log(house);

		for (var i=0; i<house.names.length; i++) {
			var div = document.createElement('div');
			div.setAttribute("class", "official-info");
			section.appendChild(div);
			
			if (house.images[i] != undefined && house.images[i] != 'none') {
				var img = document.createElement('img');
				img.setAttribute("class", "profile-image");
				img.setAttribute("src", house.images[i]);
				div.appendChild(img);
			}

			if (house.names[i] != undefined && house.names[i] != 'none') {
				var nameText = document.createElement('h3');
				nameText.innerHTML = house.names[i];
				div.appendChild(nameText);
			}

			if (house.parties[i] != undefined && house.parties[i] != 'none') {
				var span = document.createElement('span');
				span.innerHTML = ' (' + house.parties[i][0] + ')';
				nameText.appendChild(span);
			}

			if (house.titles[i] != undefined && house.titles[i] != 'none') {
				var titleText = document.createElement('h5');
				titleText.innerHTML = house.titles[i];
				div.appendChild(titleText);
			}

			if (house.websites[0] != undefined && house.websites[i] != 'none') {
				var anchor = document.createElement('a');
				anchor.setAttribute("href", house.websites[i]);
				anchor.setAttribute("target", "_blank");
				anchor.setAttribute("class", "website-link");
				anchor.innerHTML = 'Website';
				div.appendChild(anchor);
			}
		
		}

		view.convertTitle();
	}
};

view.listeners();