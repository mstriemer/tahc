(function () {
  'use strict';
 
  window.MessageRepository = class {
    constructor() {
      this.username = null;
      this.messages = [];
      this.onChanges = [];
      this.channel = new SharedWorker('static/js/broadcaster.js').port;
      this.channel.start();
      this.channel.addEventListener('message', function (e) {
        this.add(e.data);
      }.bind(this));
    }
    all() {
      return this.messages;
    }
    add(message) {
      this.messages.push(message);
      if (message.sender === this.username) {
        this.channel.postMessage(message);
      }
      this.notifyChanges(message);
    }
    notifyChanges(message) {
      this.onChanges.forEach(function (callback) {
        callback(message);
      });
    }
    onChange(callback) {
      this.onChanges.push(callback);
    }
    register(username) {
      this.username = username;
      this.channel.postMessage({register: username});
    }
  }

 })();