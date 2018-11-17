import React, { Component } from 'react';
import Friend from './Friend';
import ChatBox from './ChatBox';
import axios from 'axios';

class ChatApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      chats: []
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(user) {
    this.setState({
      user: user
    })
    axios.get('/recentChats/' + user.id).then(res => {
      console.log(res.data)
      this.setState({ chats: res.data });
    })
  }

  render() {
    return (
      <div className="container">
        <div id="output"></div>
        <div className="messaging">
          <div className="inbox_msg">
            <Friend setUser={this.setUser} user={this.state.user} />
            <ChatBox user={this.state.user} chats={this.state.chats} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatApp;
