"use strict";

function copy(id) {
	var copyText = document.getElementById(id);
	copyText.select();
	document.execCommand("copy");
} 

function hideAll() {
	var els = document.querySelectorAll('.tabs-active')
	for (var i = 0; i < els.length; i++) {
		els[i].classList.remove('tabs-active')
	}
}
function show(id) {
	hideAll();
	var element = document.getElementById(id);
	element.classList.add("tabs-active");
}

// Base64
function decodeBase64() {
	var encodedData = document.getElementById("base64-encoded").value; 
	document.getElementById("base64-decoded").value = window.atob(encodedData); 
}
function encodeBase64() {
	var encodedData = document.getElementById("base64-decoded").value; 
	document.getElementById("base64-encoded").value = window.btoa(encodedData); 
}

// Docs
function cpf() {
	document.getElementById("doc").value = "Not implemented!"; 
}
function cnpj() {
	document.getElementById("doc").value = "Not implemented!"; 
}

function uuid() {
	id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
	document.getElementById("uuid-value").value = id;
}

// JSON
function beautifyJSON() {
	var input = document.getElementById("json-input").value; 
  var formatted = '';
  let spaces = 0;
  for (var i = 0; i < input.length; i++) {
    function closing(c) {
      return ['}', ']'].indexOf(c) >= 0;
    }
    function opening(c) {
      return ['{', '['].indexOf(c) >= 0;
    }
    let c = input[i];
    let previous = input[i-1];
    let next = input[i+1];

    let comma = c == ',' && !closing(previous);
    if (closing(c)) {
      formatted += "\n";
      spaces -= 2;
      if (spaces > 0) {
        formatted += " ".repeat(spaces);
      }
    }

    formatted += c

    if (opening(c)) {
      formatted += "\n";
      spaces += 2;
      if (spaces > 0) {
        formatted += " ".repeat(spaces)
      }
    } else if (c == ':' && next != ' ' && !closing(next)) {
      formatted += " ";
    } else if (c == ',') {
      formatted += "\n";
      if (spaces > 0) {
        formatted += " ".repeat(spaces);
      }
    }
  }
	document.getElementById("json-output").value = formatted;
}

(() => {
  show('json');
})();
