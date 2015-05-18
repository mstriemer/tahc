(function() {
	'use strict';

	var tahcSendTemplate = `<form>
		<input type="hidden" name="sender">
		<input type="text" name="message">
		<button type="submit">Send</button>
	</form>`;

	class TahcSend extends HTMLElement {
		attachedCallback() {
			this.messageInput.focus();
		}
		createdCallback() {
			this.innerHTML = tahcSendTemplate;
			this.form = this.querySelector('form');
			this.messageInput = this.querySelector('input[name="message"]');

			this.form.addEventListener('submit', function (e) {
				e.preventDefault();
				this.dispatchEvent(new CustomEvent('message', {
					bubbles: true,
					detail: {
						sender: this.sender,
						message: this.message,
						sentAt: new Date(),
					},
				}));
			}.bind(this));

			this.addEventListener('message', function (e) {
				this.messageInput.value = '';
			}.bind(this));
		}
		get sender() {
			return this.getAttribute('sender');
		}
		get message() {
			return this.messageInput.value;
		}
	}
	document.registerElement('tahc-send', TahcSend);

	class TahcMessages extends HTMLElement {
		createdCallback() {
			document.body.addEventListener('message', function (e) {
				var pre = document.createElement('pre');
				pre.textContent = JSON.stringify(e.detail);
				this.appendChild(pre);
			}.bind(this));
		}
	}
	document.registerElement('tahc-messages', TahcMessages);

	class TahcBroadcast extends HTMLElement {
		attachedCallback() {
			var channel = new SharedWorker('static/js/broadcaster.js').port;
			channel.start();

			// Register this user.
			channel.postMessage({register: this.username});

			// Receive a message on the channel.
			channel.addEventListener('message', function (e) {
				this.dispatchEvent(new CustomEvent('message', {
					bubbles: true,
					detail: e.data,
				}));
			}.bind(this));

			// Broadcast a message on the channel.
			document.body.addEventListener('message', function (e) {
				if (e.detail.sender === this.username) {
					channel.postMessage(e.detail);
				}
			}.bind(this));
		}
		get username() {
			return this.getAttribute('sender');
		}
	}
	document.registerElement('tahc-broadcast', TahcBroadcast);

	var tahcTemplate = `
		<tahc-user-info></tahc-user-info>
		<tahc-broadcast></tahc-broadcast>
		<tahc-messages></tahc-messages>
		<tahc-send></tahc-send>
	`;
	class TahcRegister extends HTMLElement {
		attachedCallback() {
			this.usernameInput.focus();
		}
		createdCallback() {
			this.form.addEventListener('submit', function (e) {
				e.preventDefault();
				var template = document.createElement('template');
				template.innerHTML = tahcTemplate;
				var content = document.importNode(template.content, true);
				for (var i = 0; i < content.children.length; i++) {
					content.children[i].setAttribute('sender', this.username);
				}
				this.parentNode.appendChild(content);
				this.parentNode.removeChild(this);
			}.bind(this));
		}
		get form() {
			return this.querySelector('form');
		}
		get username() {
			return this.usernameInput.value;
		}
		get usernameInput() {
			return this.querySelector('input[name="username"]');
		}
	}
	document.registerElement('tahc-register', TahcRegister);

	class TahcUserInfo extends HTMLElement {
		attachedCallback() {
			this.textContent = `Logged in as ${this.getAttribute('sender')}`;
		}
	}
	document.registerElement('tahc-user-info', TahcUserInfo);
})();
