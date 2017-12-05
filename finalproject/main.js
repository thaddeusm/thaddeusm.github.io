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
		view.hideElement('#keywordChoice');
		view.showElement('.reveal');
	},
	loadOptions: function() {
		presentation.shuffleData();
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
	}
};


Reveal.initialize({
	dependencies: [
		{ src: 'plugin/markdown/marked.js' },
		{ src: 'plugin/markdown/markdown.js' },
		{ src: 'plugin/notes/notes.js', async: true },
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
	]
});

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
