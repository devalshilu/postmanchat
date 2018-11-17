import React, { Component } from 'react';
import axios from 'axios';

class Friend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            items: []
        };
        this.filterList = this.filterList.bind(this);
    }
    filterList(event) {
        var updatedList = this.state.friends;
        updatedList = updatedList.filter(function (item) {
            console.log(item.name)
            return item.name.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({ items: updatedList });
        console.log(this.state.items.length)
    }
    componentDidMount() {
        axios.get('/allFriends').then(res => {
            console.log(res.data)
            this.setState({
                friends: res.data, items: res.data
            });
            this.props.setUser(res.data[0])
        })
    }
    render() {
        return (
            <div className="inbox_people">
                <div className="headind_srch">
                    <div className="srch_bar">
                        <div className="stylish-input-group">
                            <input type="text" className="search-bar" placeholder="Search" onChange={this.filterList} name="Search" />
                            <span className="input-group-addon">
                                <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
                            </span> </div>
                    </div>
                </div>
                <div className="inbox_chat">
                    {this.state.items.map((friend, index) => (
                        <div className={"chat_list " + (this.props.user.id == friend.id ? 'active_chat' : '')}>
                            <div onClick={() => this.props.setUser(friend)} className="chat_people">
                                <div className="chat_img"> <img src={friend.picture} alt=" picture" /> </div>
                                <div className="chat_ib">
                                    <h5>{friend.name}</h5>
                                    <p>{friend.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Friend;
