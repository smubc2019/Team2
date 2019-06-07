import React, { Component } from 'react';

class LikeBtn extends Component {
  constructor() {
    super();
    this.state = {
        showMsg: false,
        msg: '',
    };
  }

  checkLike = () => {
    fetch("/api/checklike", {
        method: "GET",
        dataType: "JSON",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        }
    })
    .then(res => res.json())
    .then(data => {
        this.setState({showMsg: true, msg: data.msg});
    })    
  }

  claimReward = () => {
    fetch("/api/claim", {
        method: "GET"
    })
  }

  render() {
    const showMsg = this.state.showMsg;
    return (
      <div>
        <button onClick={this.checkLike}>Like!</button>
        {showMsg ?
            <div> 
            <h2>{JSON.stringify(this.state.msg)}</h2> 
            <button onClick={this.claimReward}>Claim your rewards here!</button>
            </div> 
            : ''}
      </div>
    );
  }
}

export default LikeBtn;
