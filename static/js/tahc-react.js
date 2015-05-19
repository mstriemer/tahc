(function () {
  'use strict';

  var messageRepository = new MessageRepository();

  var TahcApp = React.createClass({
    getInitialState: function () {
      return {sender: ''};
    },
    render: function () {
      if (this.state.sender) {
        return <div>
          <span>Logged in as {this.state.sender}</span>
          <TahcMessages messages={this.props.repository.all()} />
          <TahcSend sendMessage={this.sendMessage} />
        </div>;
      } else {
        return <TahcRegister signIn={this.signIn} />
      }
    },
    sendMessage: function (message) {
      this.props.repository.add({
        sender: this.state.sender,
        message: message,
        sentAt: new Date(),
      });
    },
    signIn: function (username) {
      this.setState({sender: username});
      this.props.repository.register(username);
    },
  });

  var TahcMessages = React.createClass({
    render: function () {
      var messages = this.props.messages.map(function (message) {
        return <pre>{JSON.stringify(message)}</pre>;
      });
      return <div>{messages}</div>;
    },
  });

  var TahcSend = React.createClass({
    render: function () {
      return <form onSubmit={this.handleNewMessage}>
        <input type="text" ref="message" autoFocus={true} required />
        <button type="submit">Send</button>
      </form>;
    },
    handleNewMessage: function (e) {
      e.preventDefault();

      var messageNode = this.refs.message.getDOMNode();
      this.props.sendMessage(messageNode.value);
      messageNode.value = '';
    },
  });

  var TahcRegister = React.createClass({
    render: function () {
      return <form onSubmit={this.handleSignIn}>
        <input type="text" ref="username" autoFocus={true} required />
        <button type="submit">Sign In</button>
      </form>;
    },
    handleSignIn: function (e) {
      e.preventDefault();
  
      this.props.signIn(this.refs.username.getDOMNode().value);
    },
  });

  function render() {
    React.render(<TahcApp repository={messageRepository} />, document.body);
  }

  messageRepository.onChange(render);
  render();
})();
