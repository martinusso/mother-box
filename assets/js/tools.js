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

function decodeBase64() {
	var encodedData = document.getElementById("base64-encoded").value;
	document.getElementById("base64-decoded").value = window.atob(encodedData);
}
function encodeBase64() {
	var encodedData = document.getElementById("base64-decoded").value;
	document.getElementById("base64-encoded").value = window.btoa(encodedData);
}

function cleanDocument(doc) {
	return doc.replace(/\D/g, '');
}

function formatCPF(cpf) {
	const cleaned = cleanDocument(cpf);
	return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatCNPJ(cnpj) {
	const cleaned = cleanDocument(cnpj);
	return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function validateCPF(cpf) {
	const cleaned = cleanDocument(cpf);

	if (cleaned.length !== 11) return false;
	if (/^(\d)\1{10}$/.test(cleaned)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cleaned[i]) * (10 - i);
	}
	let digit1 = 11 - (sum % 11);
	if (digit1 >= 10) digit1 = 0;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(cleaned[i]) * (11 - i);
	}
	let digit2 = 11 - (sum % 11);
	if (digit2 >= 10) digit2 = 0;

	return digit1 === parseInt(cleaned[9]) && digit2 === parseInt(cleaned[10]);
}

function validateCNPJ(cnpj) {
	const cleaned = cleanDocument(cnpj);

	if (cleaned.length !== 14) return false;
	if (/^(\d)\1{13}$/.test(cleaned)) return false;

	let length = cleaned.length - 2;
	let numbers = cleaned.substring(0, length);
	let digits = cleaned.substring(length);
	let sum = 0;
	let pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

	length = length + 1;
	numbers = cleaned.substring(0, length);
	sum = 0;
	pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

	return digit1 === parseInt(digits[0]) && digit2 === parseInt(digits[1]);
}

function generateCPF() {
	let cpf = '';
	for (let i = 0; i < 9; i++) {
		cpf += Math.floor(Math.random() * 10);
	}

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cpf[i]) * (10 - i);
	}
	let digit1 = 11 - (sum % 11);
	if (digit1 >= 10) digit1 = 0;
	cpf += digit1;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(cpf[i]) * (11 - i);
	}
	let digit2 = 11 - (sum % 11);
	if (digit2 >= 10) digit2 = 0;
	cpf += digit2;

	document.getElementById("doc").value = formatCPF(cpf);
}

function generateCNPJ() {
	let cnpj = '';
	for (let i = 0; i < 12; i++) {
		cnpj += Math.floor(Math.random() * 10);
	}

	let length = 12;
	let numbers = cnpj.substring(0, length);
	let sum = 0;
	let pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	cnpj += digit1;

	length = 13;
	numbers = cnpj.substring(0, length);
	sum = 0;
	pos = length - 7;

	for (let i = length; i >= 1; i--) {
		sum += parseInt(numbers.charAt(length - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
	cnpj += digit2;

	document.getElementById("doc").value = formatCNPJ(cnpj);
}

function validateDocument() {
	const input = document.getElementById("doc-validate").value.trim();
	const resultDiv = document.getElementById("doc-validation-result");

	if (!input) {
		resultDiv.style.display = 'none';
		return;
	}

	const cleaned = cleanDocument(input);
	let isValid = false;
	let docType = '';
	let formatted = '';

	if (cleaned.length === 11) {
		isValid = validateCPF(cleaned);
		docType = 'CPF';
		formatted = formatCPF(cleaned);
	} else if (cleaned.length === 14) {
		isValid = validateCNPJ(cleaned);
		docType = 'CNPJ';
		formatted = formatCNPJ(cleaned);
	} else {
		resultDiv.style.display = 'block';
		resultDiv.style.backgroundColor = '#ffe6e6';
		resultDiv.style.color = '#d32f2f';
		resultDiv.innerHTML = '<strong>Invalid format:</strong> Document must have 11 digits (CPF) or 14 digits (CNPJ)';
		return;
	}

	resultDiv.style.display = 'block';
	if (isValid) {
		resultDiv.style.backgroundColor = '#e8f5e9';
		resultDiv.style.color = '#2e7d32';
		resultDiv.innerHTML = `<strong>✓ Valid ${docType}:</strong> ${formatted}`;
	} else {
		resultDiv.style.backgroundColor = '#ffe6e6';
		resultDiv.style.color = '#d32f2f';
		resultDiv.innerHTML = `<strong>✗ Invalid ${docType}:</strong> ${formatted || input}`;
	}
}

function uuid() {
	let uuidValue;

	try {
		if (crypto && crypto.randomUUID) {
			uuidValue = crypto.randomUUID();
		} else if (crypto && crypto.getRandomValues) {
			const bytes = new Uint8Array(16);
			crypto.getRandomValues(bytes);

			bytes[6] = (bytes[6] & 0x0f) | 0x40;
			bytes[8] = (bytes[8] & 0x3f) | 0x80;

			const hex = Array.from(bytes)
				.map(b => b.toString(16).padStart(2, '0'))
				.join('');

			uuidValue = [
				hex.slice(0, 8),
				hex.slice(8, 12),
				hex.slice(12, 16),
				hex.slice(16, 20),
				hex.slice(20, 32)
			].join('-');
		} else {
			uuidValue = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				const r = Math.random() * 16 | 0;
				const v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		document.getElementById("uuid-value").value = uuidValue;
	} catch (err) {
		console.error('Failed to generate UUID:', err);
		document.getElementById("uuid-value").value = '';
		alert('Failed to generate UUID. Please try again.');
	}
}

function unescapeJSONString(str) {
	let result = '';
	let i = 0;

	while (i < str.length) {
		if (str[i] === '\\' && i + 1 < str.length) {
			const next = str[i + 1];
			switch (next) {
				case '"':
					result += '"';
					i += 2;
					break;
				case '/':
					result += '/';
					i += 2;
					break;
				case '\\':
					result += '\\';
					i += 2;
					break;
				case 'n':
					result += '\n';
					i += 2;
					break;
				case 't':
					result += '\t';
					i += 2;
					break;
				case 'r':
					result += '\r';
					i += 2;
					break;
				case 'u':
					if (i + 5 < str.length) {
						const hex = str.substring(i + 2, i + 6);
						result += String.fromCharCode(parseInt(hex, 16));
						i += 6;
					} else {
						result += str[i];
						i++;
					}
					break;
				default:
					result += str[i];
					i++;
					break;
			}
		} else {
			result += str[i];
			i++;
		}
	}

	return result;
}

function beautifyJSON() {
	let input = document.getElementById("json-input").value.trim();
	const outputElement = document.getElementById("json-output");
	const errorElement = document.getElementById("json-error");

	if (!input) {
		outputElement.value = '';
		if (errorElement) {
			errorElement.textContent = '';
			errorElement.style.display = 'none';
		}
		return;
	}

	try {
		let parsed;

		try {
			parsed = JSON.parse(input);
		} catch (firstError) {
			if ((input.startsWith('{') || input.startsWith('[')) && input.includes('\\"')) {
				try {
					if ((input.startsWith('"') && input.endsWith('"')) ||
					    (input.startsWith("'") && input.endsWith("'"))) {
						input = input.slice(1, -1);
					}

					const unescaped = unescapeJSONString(input);
					parsed = JSON.parse(unescaped);
				} catch (secondError) {
					throw firstError;
				}
			} else {
				throw firstError;
			}
		}

		const formatted = JSON.stringify(parsed, null, 2);
		outputElement.value = formatted;

		if (errorElement) {
			errorElement.textContent = '';
			errorElement.style.display = 'none';
		}
	} catch (err) {
		outputElement.value = '';
		if (errorElement) {
			errorElement.textContent = 'Error: Invalid JSON. ' + err.message;
			errorElement.style.display = 'block';
		}
	}
}

(() => {
  show('json');
})();
