/* var interpretMarkDown = function() {

	var parseString = $("textarea").val(),
		parseArray = [],
		parseLines = 0;

	// Deactivate HTML by replacing < by &lt;
	parseString = parseString.replace(/</g,"&lt;");

	// Break the text into an array of lines, for easier parsing
	parseArray = parseString.split("\n");
	parseLines = parseArray.length;

	// All lines that are only spaces are emptied
	for (var i = 0; i < parseLines; i++) {
		parseArray[i] = parseArray[i].trim();
	}

	// 1 or more consecutive empty lines generate separate paragraphs
	for (var i = 0; i < parseLines; i++) {
		if ( parseArray[i] != "" && ( parseArray[i-1] == "" || i == 0 ) ) {
			parseArray[i] = "<p>" + parseArray[i];
		}
		if ( parseArray[i] != "" && ( parseArray[i+1] == "" || i == parseLines-1 ) ) {
			parseArray[i] += "</p>";
		}
	}

	// New lines at the end of non empty lines that do not end with > generate line breaks
	for (var i = 0; i < parseLines; i++) {
		if ( parseArray[i] != "" && parseArray[i].charAt(parseArray[i].length-1) != ">" ) {
			parseArray[i] += "<br/>";
		}
	}


	console.clear();
	console.log(parseArray.join("\n"));


	// Single line breaks become <br/>, double line breaks become new paragraphs

	$("#preview section").html(parseArray.join("\n"));

} */

// Algorithme simplifié basé librement sur celui de la version perl d'origine, trouvé ici :
// https://daringfireball.net/projects/markdown/

var parseMarkDown = function(text) {

	var textArray = [],
		numLines = 0;

	// On rajoute deux retours chariot au début et à la fin du texte
	text = "\n\n" + text + "\n\n";

	// On remplace les tabulations par des espaces
	text = deTab(text);

	// On vide les lignes ne contenant que des espaces
	textArray = text.split("\n");
	numLines = textArray.length;
	for (var i = 0; i < numLines; i++) {
		if ( textArray[i].search(/[^ ]/) == -1 ) {
			textArray[i] = "";
		}
	}
	text = textArray.join("\n");

	// On désactive le HTML en remplaçant < par &lt;, > par &gt; et & par &amp;
	text = text.replace(/&/g,"&amp;");
	text = text.replace(/</g,"&lt;");
	text = text.replace(/>/g,"&gt;");

	// Ici, identifie les blocs et on les traite.
	text = parseBlocks(text);

	// On enlève les caractères vides qui précèdent
	text = text.trim();

	console.clear();
	console.log(text);

	return text;

};

var deTab = function(text) {

	// Cette fonction remplace le caractère tab par quatre espaces

	return text.replace(/\t/g,"    ");

};

var parseBlocks = function(text) {

	// On identifie les headers et on les traite
	text = text.replace(/(\#{1,6}) +(.+?) *\#*\n+/g, function(match, p1, p2) {
		return "<h" + p1.length + ">" + p2 + "</h" + p1.length + ">\n\n";
	});

	// On identifie les barres horizontales et on les traite
	text = text.replace(/\+{3,}/g,"\n<hr>\n");
	text = text.replace(/-{3,}/g,"\n<hr>\n");
	text = text.replace(/\*{3,}/g,"\n<hr>\n");
	text = text.replace(/={3,}/g,"\n<hr>\n");
	text = text.replace(/_{3,}/g,"\n<hr>\n");
	text = text.replace(/\.{3,}/g,"\n<hr>\n");

	// On identifie et on traite les listes

	// On identifie et on traite les blocs de code
	text = parseCodeBlocks(text);

	// On identifie et on traite les citations
	text = parseBlockQuotes(text);

	// On identifie et on traite les paragraphes
	text = parseParagraphs(text);

	return text;

};

var parseInline = function(text) {

	// Traitement des liens
	text = parseLinks(text);

	// Traitement des mots en gras
	text = text.replace(/\*\*([^\*]+)\*\*/g,"<strong>$1</strong>")

	// Traitement des soulignés
	text = text.replace(/__([^_]+)__/g,"<u>$1</u>")

	// Traitement des italiques
	text = text.replace(/([\*_])([^\*_]+)\1/g,"<em>$2</em>")

	return text;

};

var parseLists = function(text) {

	return text;

}

var parseCodeBlocks = function(text) {

	return text;

}

var parseBlockQuotes = function(text) {

	return text;

}

var parseParagraphs = function(text) {

	var parseArray = text.split(/\n{2,}/);

	for (var i = 0; i < parseArray.length; i++) {
		if ( ( parseArray[i].charAt(0) != "<" || parseArray[i].charAt(parseArray[i].length-1) != ">" ) && parseArray[i] != "" ) {
			parseArray[i] = "<p>" + parseInline(parseArray[i]) + "</p>";
		} else {
			parseArray[i] = parseInline(parseArray[i]);
		}
	}

	return parseArray.join("\n\n");

}

var parseLinks = function(text) {

	return text.replace(/\[(.+)\]\((\S+?)\)/g,"<a href=\"$2\">$1</a>")

};







$(document).ready(function(){

	$("textarea").on( "keyup", function(){
		$("#preview section").html(parseMarkDown($("textarea").val()));
	});

});