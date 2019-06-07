const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");
//const db = require('./dbfunctions.js');
const web3 = require('web3');
const web3Provider = new web3('http://localhost:8545');
const abi = JSON.parse(fs.readFileSync('./contracts/LIKEToken.abi').toString())

//Contract, Account Addresses
const myContract = new web3Provider.eth.Contract(abi, '0xDFb71948371aE15D69039329060827B96C51e3c3');
const ownAddr = '0x2B90c31Cde237Ea8Bf60647781188A9bA08Da368'; //Owner of the contract
const userAddr = '0xFcd0801e7d2352731696f6a6b0aE9C82dB0E9608';
const contriToAddr = '0xDAfd976817F0F41bafE35DC9236b6b2171C56D56';

const app = express();
app.use(bodyParser.json());

web3Provider.eth.getBlockNumber().then(data=>{
  console.log('Block: '+data);
})

app.get('/api/home', (req, res) => {
  console.log('/api/home');
  web3Provider.eth.getBlockNumber().then((block) => {
    myContract.methods.totalSupply().call().then((totalSupply) => {
      myContract.methods.currentSupply().call().then((currentSupply) => {
        myContract.methods.balanceOf(userAddr).call().then((bal) => {
          myContract.methods.balanceOf(contriToAddr).call().then((domainBal) => {
            res.json({block: block, totalSupply: totalSupply.toNumber(), currentSupply: currentSupply.toNumber(), bal: bal.toNumber(), domainBal: domainBal.toNumber()});
          })
        })
      })
    })
  });
});

app.get('/api/checklike', (req, res) => {
  console.log('/api/checklike');
 
  web3Provider.eth.getBlockNumber().then(blockNo=>{
    if (blockNo % 10 == 0) {
      //if(blockNo+randomNo() == blockNo) {
        console.log('WIN')
        res.json({win: true});
      //}
    }
  });
});

app.post('/api/claim', (req, res) => {
  console.log('/api/claim');

  let toAddr = req.body.toAddr; //userAddr's value
  //let contriTo = req.body.contriTo;
  let contriToPerc = req.body.contriToPerc;
  let receivedPerc = 1 - contriToPerc;
  let rewardAmt = 10;

  myContract.methods.transfer(toAddr, rewardAmt*receivedPerc).send({from: ownAddr}, (error, txHash) => {
    myContract.methods.transfer(contriToAddr, rewardAmt*contriToPerc).send({from: ownAddr}, (error2, txHash2) => {
      res.json({claim: true});
    })
  });
})

app.post('/api/spend', (req, res) => {
  console.log('/api/spend');

  let burnAmt = 5;

  myContract.methods.burn(burnAmt).send({from: userAddr}, (error, txHash) => {
    res.json({spend: true});
  })
})

const port = 8000;

app.listen(port, () => console.log(`Server running on port ${port}`));

//Generate a random number between 0 to 9
function randomNo() {
  return Math.floor(Math.random() * 10);
}