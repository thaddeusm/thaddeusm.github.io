var presentation = {
	data: [],
	choices: [],
	choice: '',
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
	pushChoices: function() {
		for (let i=0; i<2; i++) {
			this.choices.push(this.data[i]);
		}
		console.log(this.choices);
		view.printChoices();
	}
};

var controller = {
	startListeners: function() {
		var startButton = document.getElementById('startButton');

		startButton.addEventListener('click', function() {
			var startScreen = document.getElementById('start');
			var choiceScreen = document.getElementById('keywordChoice');

			startScreen.style.display = 'none';
			choiceScreen.style.display = 'grid';
		});
	},
	startPresentation: function(choice) {
		presentation.choice = presentation.choices[choice];
		view.printSlideContent();
	},
	loadOptions: function() {
		presentation.shuffleData();
	},
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
	restart: function() {
		location.reload(true);
	}
};

var view = {
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

		var restartButton = '<h3>Restart</h3><br><br><button type="button" onclick="controller.restart()"><img src="media/return.svg" alt="return icon" class="link-icon"></button>';
		var restartSlide = this.buildSection(restartButton);

		slides.appendChild(photoSlide);
		slides.appendChild(quoteSlide);
		slides.appendChild(promptSlide);
		slides.appendChild(resourceSlide);
		slides.appendChild(restartSlide);

		setTimeout(function() {
			controller.initSlides();
		}, 500);

		this.hideElement('#keywordChoice');
		this.displayElement('.reveal');

	},
	displayElement: function(element) {
		if (arguments[1]) {
			document.querySelector(element).style.display = 'grid';
		} else {
			document.querySelector(element).style.display = 'block';
		}
	},
	hideElement: function(element) {
		document.querySelector(element).style.display = 'none';
	},
	buildButton: function(content, onclick) {
		let button = document.createElement('button');

		button.setAttribute('onclick', onclick);
		button.setAttribute('type', 'button');
		button.setAttribute('class', 'choice-button')
		button.innerHTML = content;

		return button;
	},
	buildSection: function(content) {
		let section = document.createElement('section');
		section.innerHTML = content;

		return section;
	}
};

function init() {
	Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1mtqTFGXCJbnX15p3WYYY8h4MIg9G-UiEwNy16MX5CJ4/edit?usp=sharing',
	callback: function(data, tabletop) { 
	   for (var i=0; i<data.length; i++) {
	   		if (data[i]['Additional Resources'].length > 1 && data[i]['Characteristic'].length > 1 && data[i]['Image Link'].length > 1 && data[i]['Personal Prompt'].length > 1 && data[i]['Quote'].length > 1) {
	   			presentation.data.push(data[i]);
	   		}
	   }
	   controller.loadOptions();
	},
	simpleSheet: true } )
}
window.addEventListener('DOMContentLoaded', init);

controller.startListeners();
