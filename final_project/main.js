function init() {
  Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/1mtqTFGXCJbnX15p3WYYY8h4MIg9G-UiEwNy16MX5CJ4/edit?usp=sharing',
                   callback: function(data, tabletop) { 
                       for (var i=0; i<data.length; i++) {
                       		if (data[i]['Additional Resources'].length > 1 && data[i]['Characteristic'].length > 1 && data[i]['Image Link'].length > 1 && data[i]['Personal Prompt'].length > 1 && data[i]['Quote'].length > 1) {
                       			console.log(data[i]);
                       		}
                       }
                   },
                   simpleSheet: true } )
}
window.addEventListener('DOMContentLoaded', init);