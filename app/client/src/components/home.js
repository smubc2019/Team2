import React, { Component } from 'react';
import './home.css';
import Modal from './modal';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      block: '',
      totalSupply:'',
      currentSupply: '',
      bal: '',
      domainBal: '',
      showMsg: false,
      winMsg: 'Congratulations, You are the lucky winner. Claim your reward below',
      spendSuccess: false,
      claimClicked: false,
      likeClicked: false,
      modalOpen: false
    };
  }
  
  componentDidMount() {
    fetch('/api/home')
      .then(res => res.json())
      .then( (block, totalSupply, currentSupply, bal, domainBal) => this.setState(block, totalSupply, currentSupply, bal, domainBal))
  }

  componentDidUpdate() {
    if(this.state.claimClicked || this.state.spendSuccess) {
      fetch('/api/home')
      .then(res => res.json())
      .then( (block, totalSupply, currentSupply, bal, domainBal) => this.setState(block, totalSupply, currentSupply, bal, domainBal))
      .then( () => {
        if(this.state.claimClicked) 
          this.setState({claimClicked: false})
        else if (this.state.spendSuccess)
          this.setState({spendSuccess: false})
      });
    }
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  updateClaimStatus = (claimed) => {
    console.log('updateclaimstatus:'+claimed);
    this.setState({showMsg: false, claimClicked: claimed});
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
      if(data.win)
        this.setState({likeClicked: true, showMsg: true});
    })    
  }

  spendToken = () => {
    fetch("/api/spend", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      if(data.spend)
        this.setState({spendSuccess: true});
    })   
  }

  render() {
    const likeClicked = this.state.likeClicked;
    const showMsg = this.state.showMsg;
    return (
      <div>
        <h2>Current Block Number: {this.state.block}</h2>
        <h3>Total Token Supply: {this.state.totalSupply}</h3>
        <h4>Current Token Supply: {this.state.currentSupply}</h4>
        <p></p>
        User's received tokens: {this.state.bal}
        <p></p>
        Domain's received tokens: {this.state.domainBal}
        <p></p>
        {likeClicked ?
          <button>Liked</button>
          : <button onClick={this.checkLike}>Like!</button>
        }

        <p></p>
        <button onClick={this.spendToken}>Spend Your Tokens</button>

        {showMsg ?
            <div> 
            <h3>{this.state.winMsg}</h3> 
            <button onClick={this.toggleModal}>Claim your rewards here!</button>
            <Modal show={this.state.modalOpen} onClose={this.toggleModal} getClaimStatus={this.updateClaimStatus}></Modal>
            </div> 
            : ''}
      </div>
    );
  }
}

export default Home;
