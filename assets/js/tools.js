"use strict";

// Clipboard API with fallback
async function copy(id) {
	const copyText = document.getElementById(id);
	if (!copyText) {
		console.error('Element not found:', id);
		return;
	}

	try {
		// Modern Clipboard API
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(copyText.value);
			return;
		}

		// Fallback for older browsers
		copyText.select();
		copyText.setSelectionRange(0, 99999); // For mobile devices

		if (document.execCommand("copy")) {
			window.getSelection().removeAllRanges();
		} else {
			throw new Error('Copy command failed');
		}
	} catch (err) {
		console.error('Failed to copy text:', err);
		alert('Failed to copy to clipboard. Please copy manually.');
	}
}

function hideAll() {
	const els = document.querySelectorAll('.tabs-active');
	for (let i = 0; i < els.length; i++) {
		els[i].classList.remove('tabs-active');
	}

	const tabs = document.querySelectorAll('[role="tab"]');
	tabs.forEach(tab => {
		tab.setAttribute('aria-selected', 'false');
		tab.setAttribute('tabindex', '-1');
	});

	const panels = document.querySelectorAll('[role="tabpanel"]');
	panels.forEach(panel => {
		panel.setAttribute('aria-hidden', 'true');
	});
}

function show(id) {
	hideAll();
	const element = document.getElementById(id);
	if (element) {
		element.classList.add("tabs-active");
		element.setAttribute('aria-hidden', 'false');
	}

	const tab = document.querySelector(`[data-tab="${id}"]`);
	if (tab) {
		tab.setAttribute('aria-selected', 'true');
		tab.setAttribute('tabindex', '0');
		tab.focus();
	}
}

// Base64 with UTF-8 support and error handling
function decodeBase64() {
	const encodedData = document.getElementById("base64-encoded").value.trim();
	const decodedElement = document.getElementById("base64-decoded");
	const errorElement = document.getElementById("base64-error");

	if (!encodedData) {
		decodedElement.value = '';
		errorElement.textContent = '';
		errorElement.classList.remove('show');
		return;
	}

	try {
		const decoded = window.atob(encodedData);

		try {
			const utf8Decoded = decodeURIComponent(
				decoded.split('').map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				}).join('')
			);
			decodedElement.value = utf8Decoded;
		} catch (e) {
			// If UTF-8 decoding fails, use the raw decoded value
			decodedElement.value = decoded;
		}

		errorElement.textContent = '';
		errorElement.classList.remove('show');
	} catch (err) {
		decodedElement.value = '';
		errorElement.textContent = 'Error: Invalid Base64 input. ' + err.message;
		errorElement.classList.add('show');
	}
}

function encodeBase64() {
	const decodedData = document.getElementById("base64-decoded").value;
	const encodedElement = document.getElementById("base64-encoded");
	const errorElement = document.getElementById("base64-error");

	if (!decodedData) {
		encodedElement.value = '';
		errorElement.textContent = '';
		errorElement.classList.remove('show');
		return;
	}

	try {
		const utf8Encoded = encodeURIComponent(decodedData).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode(parseInt(p1, 16));
		});
		encodedElement.value = window.btoa(utf8Encoded);

		errorElement.textContent = '';
		errorElement.classList.remove('show');
	} catch (err) {
		encodedElement.value = '';
		errorElement.textContent = 'Error: Failed to encode. ' + err.message;
		errorElement.classList.add('show');
	}
}

// Docs
function cpf() {
	document.getElementById("doc").value = "Not implemented!";
}

function cnpj() {
	document.getElementById("doc").value = "Not implemented!";
}

// UUID generation using crypto API
function uuid() {
	let uuidValue;

	try {
		// Use crypto.randomUUID() if available (modern browsers)
		if (crypto && crypto.randomUUID) {
			uuidValue = crypto.randomUUID();
		} else if (crypto && crypto.getRandomValues) {
			// Fallback: generate UUID v4 using crypto.getRandomValues
			const bytes = new Uint8Array(16);
			crypto.getRandomValues(bytes);

			// Set version (4) and variant bits
			bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
			bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

			// Convert to UUID string format
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
			// Last resort: Math.random (not cryptographically secure)
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

// JSON beautify using JSON.parse and JSON.stringify
function beautifyJSON() {
	let input = document.getElementById("json-input").value.trim();
	const outputElement = document.getElementById("json-output");
	const errorElement = document.getElementById("json-error");

	if (!input) {
		outputElement.value = '';
		errorElement.textContent = '';
		errorElement.classList.remove('show');
		return;
	}

	try {
		let parsed;

		try {
			parsed = JSON.parse(input);
		} catch (firstError) {
			// If it fails, check if it's an escaped JSON string
			// This handles cases where JSON is pasted as an escaped string (e.g., {\"key\":\"value\"})
			// When pasted, \" becomes a literal backslash followed by a quote

			// Check if input looks like escaped JSON (contains \" but starts with { or [)
			if ((input.startsWith('{') || input.startsWith('[')) && input.includes('\\"')) {
				try {
					// Try to unescape: replace \" with " and \\ with \
					// We need to be careful: replace \\ first, then \"
					let unescaped = input
						.replace(/\\\\/g, '\u0000')  // Temporarily replace \\ with a placeholder
						.replace(/\\"/g, '"')         // Replace \" with "
						.replace(/\\\//g, '/')        // Replace \/ with /
						.replace(/\\n/g, '\n')        // Replace \n with newline
						.replace(/\\t/g, '\t')        // Replace \t with tab
						.replace(/\\r/g, '\r')        // Replace \r with carriage return
						.replace(/\u0000/g, '\\');    // Restore actual backslashes

					parsed = JSON.parse(unescaped);
				} catch (secondError) {
					// If unescaping doesn't work, try double-parse approach
					// Wrap input as a JSON string and parse twice
					try {
						const asJsonString = JSON.stringify(input);
						const unescaped = JSON.parse(asJsonString);
						if (typeof unescaped === 'string' && (unescaped.trim().startsWith('{') || unescaped.trim().startsWith('['))) {
							parsed = JSON.parse(unescaped);
						} else {
							throw secondError;
						}
					} catch (thirdError) {
						// If all attempts fail, throw the original error
						throw firstError;
					}
				}
			} else {
				// Doesn't look like escaped JSON, throw original error
				throw firstError;
			}
		}

		const formatted = JSON.stringify(parsed, null, 2);
		outputElement.value = formatted;

		errorElement.textContent = '';
		errorElement.classList.remove('show');
	} catch (err) {
		outputElement.value = '';
		errorElement.textContent = 'Error: Invalid JSON. ' + err.message;
		errorElement.classList.add('show');
	}
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
	const tabLinks = document.querySelectorAll('[role="tab"]');
	tabLinks.forEach(tab => {
		tab.addEventListener('click', function(e) {
			e.preventDefault();
			const tabId = this.getAttribute('data-tab');
			if (tabId) {
				show(tabId);
			}
		});

		tab.addEventListener('keydown', function(e) {
			const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
			const currentIndex = tabs.indexOf(this);
			let targetIndex = -1;

			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
				e.preventDefault();
				if (e.key === 'ArrowLeft') {
					targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
				} else {
					targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
				}
				tabs[targetIndex].focus();
				tabs[targetIndex].click();
			} else if (e.key === 'Home') {
				e.preventDefault();
				tabs[0].focus();
				tabs[0].click();
			} else if (e.key === 'End') {
				e.preventDefault();
				tabs[tabs.length - 1].focus();
				tabs[tabs.length - 1].click();
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.click();
			}
		});
	});

	// Copy buttons
	const copyButtons = document.querySelectorAll('[data-copy]');
	copyButtons.forEach(button => {
		button.addEventListener('click', function() {
			const targetId = this.getAttribute('data-copy');
			if (targetId) {
				copy(targetId);
			}
		});
	});

	// Base64 buttons
	const base64DecodeBtn = document.getElementById('base64-decode');
	if (base64DecodeBtn) {
		base64DecodeBtn.addEventListener('click', decodeBase64);
	}

	const base64EncodeBtn = document.getElementById('base64-encode');
	if (base64EncodeBtn) {
		base64EncodeBtn.addEventListener('click', encodeBase64);
	}

	// Doc buttons
	const docCpfBtn = document.getElementById('doc-cpf');
	if (docCpfBtn) {
		docCpfBtn.addEventListener('click', cpf);
	}

	const docCnpjBtn = document.getElementById('doc-cnpj');
	if (docCnpjBtn) {
		docCnpjBtn.addEventListener('click', cnpj);
	}

	// UUID button
	const generateUuidBtn = document.getElementById('generate-uuid');
	if (generateUuidBtn) {
		generateUuidBtn.addEventListener('click', uuid);
	}

	// JSON beautify button
	const beautifyJsonBtn = document.getElementById('beautify-json');
	if (beautifyJsonBtn) {
		beautifyJsonBtn.addEventListener('click', beautifyJSON);
	}

	// Show default tab (JSON)
	show('json');
});
