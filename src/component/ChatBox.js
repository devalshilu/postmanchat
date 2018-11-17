import React, { Component } from 'react';
var wsUri = "wss://echo.websocket.org/";
var websocket = new WebSocket(wsUri);
import axios from 'axios';

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            chats: []
        };
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.doSend = this.doSend.bind(this);
        this.onChange = this.onChange.bind(this);
        this.writeToScreen = this.writeToScreen.bind(this);
        this.sortedchats = this.sortedchats.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onOpen(evt) {
        this.writeToScreen("CONNECTED");
    }
    onClose(evt) {
        this.writeToScreen("DISCONNECTED");
    }
    onMessage(evt) {
        this.writeToScreen('RESPONSE: ' + evt.data);
        axios.post('/addChats/' + this.props.user.id, { text: 'RESPONSE: ' + evt.data, side: 'right' }).then(res => {
            this.setState({ chats: res.data.chatlog });
        })
    }
    onError(evt) {
        this.writeToScreen('ERROR: ' + evt.data);
    }
    doSend(message) {
        this.writeToScreen("SENT: " + message);
        axios.post('/addChats/' + this.props.user.id, { text: message, side: 'left' }).then(res => {
            if (res) {
                websocket.send(message);
                this.setState({ msg: '' });
            }
        })
    }
    writeToScreen(message) {
        console.log(message);
    }
    sortedchats(chat) {
        var finalReports = chat.sort((report1, report2) => new Date(report2.timestamp) - new Date(report1.timestamp));
        return finalReports.reverse();
    }
    componentWillReceiveProps(props) {
        this.setState({ chats: props.chats })
    }
    componentDidMount() {
        let self = this;
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) { self.onOpen(evt) };
        websocket.onclose = function (evt) { self.onClose(evt) };
        websocket.onmessage = function (evt) { self.onMessage(evt) };
        websocket.onerror = function (evt) { self.onError(evt) }
    }
    render() {
        return (
            <div className="mesgs">
                <div className="msg_head">
                    <div className="incoming_msg_img"> <img src={this.props.user && this.props.user.picture} alt=" picture" /> </div>
                    <span>{this.props.user && this.props.user.name}</span>
                </div>
                <div className="msg_history" >
                    {this.sortedchats(this.state.chats).map((chat, index) => (
                        (chat.side == 'left' ?
                            <div className="outgoing_msg">
                                <div className="sent_msg">
                                    <p>{chat.text}</p>
                                </div>
                            </div> : <div className="incoming_msg">
                                <div className="received_msg">
                                    <div className="received_withd_msg">
                                        <p>{chat.text}</p>

                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                <div className="type_msg">
                    <div className="input_msg_write">
                        <input type="text" className="write_msg" name="msg" onChange={this.onChange} value={this.state.msg} onKeyPress={(e) => {(e.key === 'Enter' ? this.doSend(this.state.msg) : null)}} placeholder="Type a message" />
                        <button className="msg_send_btn" type="button"  onClick={() => this.doSend(this.state.msg)} ><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBox;
