var TahcApp = React.createClass({
  getInitialState: function () {
    return {messages: []};
  },
  render: function () {
    var messages = this.state.messages.map(function (message) {
      return <pre>{JSON.stringify(message)}</pre>;
    });
    console.log(messages);
    return <div>
      <div class="messages">{messages}</div>
      <form onSubmit={this.handleNewMessage}>
        <input type="text" ref="message" autoFocus={true} />
        <button type="submit">Send</button>
      </form>
    </div>;
  },
  handleNewMessage: function (e) {
    e.preventDefault();
    
    var messageNode = this.refs.message.getDOMNode();

    this.state.messages.push({
      sender: this.props.sender,
      message: messageNode.value,
      sentAt: new Date(),
    });
    
    this.setState(this.state);
    
    messageNode.value = '';
  },
});

React.render(<TahcApp sender="mark" />, document.body);