// model for the single-page application
var presentation = {
	// this array will be populated by data from the Google Sheet
	data: [],
	// this array will be populated by two database items after shuffling
	choices: [],
	// this property will store the user's keyword choice
	choice: '',
	// this method shuffles the data returned by Tabletop to gamify the application
	shuffleData: function() {
		var i = 0
	      , j = 0
	      , temp = null;

	  for (i = this.data.length - 1; i > 0; i -= 1) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = this.data[i];
	    this.data[i] = this.data[j];
	    this.data[j] = temp;
	  }

	  this.pushChoices();
	},
	// after shuffling, this method pulls the first two items out of the array and
	// presents them to the user for the final decision
	pushChoices: function() {
		for (let i=0; i<2; i++) {
			this.choices.push(this.data[i]);
		}
		console.log(this.choices);
		// choices are displayed to the user
		view.printChoices();
	}
};

// controller object to handle application interactions and transitions
var controller = {
	// sets event listeners upon page load
	startListeners: function() {
		var startButton = document.getElementById('startButton');

		startButton.addEventListener('click', function() {
			var startScreen = document.getElementById('start');
			var choiceScreen = document.getElementById('keywordChoice');

			startScreen.style.display = 'none';
			choiceScreen.style.display = 'grid';
		});
	},
	// triggers Reveal JS once the user has chosen a keyword
	startPresentation: function(choice) {
		presentation.choice = presentation.choices[choice];
		view.printSlideContent();
	},
	// this method is called after Tabletop JS retrieves the database from Google Sheets
	loadOptions: function() {
		presentation.shuffleData();
	},
	// this method initializes Reveal JS once slide content has been added to the DOM
	initSlides: function() {
		Reveal.initialize({
			dependencies: [
				{ src: 'plugin/markdown/marked.js' },
				{ src: 'plugin/markdown/markdown.js' },
				{ src: 'plugin/notes/notes.js', async: true },
				{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
			]
		});
	},
	// this restarts the application for a second round
	restart: function() {
		location.reload(true);
	}
};

// the view object to control feedback and visible transitions
var view = {
	// this method displays the keyword choices to the user
	printChoices: function() {
		var first = document.getElementById('firstChoice');
		var second = document.getElementById('secondChoice');

		var firstButton = this.buildButton(
			presentation.choices[0]['Characteristic'],
			'controller.startPresentation(0)'
		);

		var secondButton = this.buildButton(
			presentation.choices[1]['Characteristic'],
			'controller.startPresentation(1)'
		);

		first.appendChild(firstButton);
		second.appendChild(secondButton);
	},
	// this method pushes slide content to the DOM from the
	// Google Sheet that Tabletop JS connected
	printSlideContent: function() {
		var slides = document.querySelector('.slides');

		var photoElement = '<img src="' + 
							presentation.choice['Image Link'] + 
							'" alt="' + 
							presentation.choice['Characteristic'] + 
							'">';

		var photoSlide = this.buildSection(photoElement);

		var quote = presentation.choice['Quote'].replace(/[\n\r]/g, '<br><br>- ');

		var quoteSlide = this.buildSection(quote);

		var prompt = presentation.choice['Personal Prompt'];

		var promptSlide = this.buildSection(prompt);

		var resourceUrl = presentation.choice['Additional Resources'];
		var resourceLink = '<h3>Additional Resource</h3><br><br><a href="' + resourceUrl + '" target="_blank"><img src="media/link.svg" class="link-icon" alt="link icon"></a>';
		var resourceSlide = this.buildSection(resourceLink);

		var restartButton = '<h3>Restart</h3><br><br><button class="restart-button" type="button" onclick="controller.restart()"><img src="media/return.svg" alt="return icon" class="link-icon"></button>';
		var restartSlide = this.buildSection(restartButton);

		// after slides are built they are pushed into the container required by Reveal JS
		slides.appendChild(photoSlide);
		slides.appendChild(quoteSlide);
		slides.appendChild(promptSlide);
		slides.appendChild(resourceSlide);
		slides.appendChild(restartSlide);

		// this manual delay helps ensure that content is fully loaded before the presentation starts
		setTimeout(function() {
			controller.initSlides();
		}, 700);

		this.hideElement('#keywordChoice');
		this.displayElement('.reveal');

	},
	// this is a reusable function that displays DOM elements
	displayElement: function(element) {
		if (arguments[1]) {
			document.querySelector(element).style.display = 'grid';
		} else {
			document.querySelector(element).style.display = 'block';
		}
	},
	// this is a reusable function that hides DOM elements
	hideElement: function(element) {
		document.querySelector(element).style.display = 'none';
	},
	// this is a reusable function that builds a DOM button element
	buildButton: function(content, onclick) {
		let button = document.createElement('button');

		button.setAttribute('onclick', onclick);
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'choice-button')
		button.innerHTML = content;

		return button;
	},
	// this is a resuable function that builds a DOM section element
	buildSection: function(content) {
		let section = document.createElement('section');
		section.innerHTML = content;

		return section;
	}
};

// initiates Tabletop JS to pull in data from Google Sheets
function init() {
	// the public URL to my Google Sheet is passed into Tabletop
	Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1mtqTFGXCJbnX15p3WYYY8h4MIg9G-UiEwNy16MX5CJ4/edit?usp=sharing',
	callback: function(data, tabletop) { 
	   // once the connection is complete, data from the spreadsheet is loaded into the application
	   for (var i=0; i<data.length; i++) {
	   		if (data[i]['Additional Resources'].length > 1 && data[i]['Characteristic'].length > 1 && data[i]['Image Link'].length > 1 && data[i]['Personal Prompt'].length > 1 && data[i]['Quote'].length > 1) {
	   			presentation.data.push(data[i]);
	   		}
	   }
	   controller.loadOptions();
	},
	simpleSheet: true } )
}
// starts Tabletop only after the page is fully loaded
window.addEventListener('DOMContentLoaded', init);

// starts event listeners
controller.startListeners();
