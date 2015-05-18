var TahcApp = React.createClass({
  getInitialState: function () {
    return {messages: []};
  },
  render: function () {
    if (this.state.sender) {
      return <div>
        <TahcMessages messages={this.state.messages} />
        <TahcSend sendMessage={this.sendMessage} />
      </div>;
    } else {
      return <TahcRegister signIn={this.signIn} />
    }
  },
  sendMessage: function (message) {
    this.state.messages.push({
      sender: this.state.sender,
      message: message,
      sentAt: new Date(),
    });
    this.setState({messages: this.state.messages});
  },
  signIn: function (username) {
    this.setState({sender: username});
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
  }
})

React.render(<TahcApp />, document.body);