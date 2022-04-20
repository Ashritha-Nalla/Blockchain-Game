import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import InputOutput from './InputOutput'

const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"))
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    const abi = MemoryToken.abi
    const address = networkData.address
    const token = new web3.eth.Contract(abi, address)
    this.setState({ token })
    const player1 = await token.methods.getPlayer1().call()
    this.setState({player1})
    console.log('player1: ',player1)
    const player2 = await token.methods.getPlayer2().call()
    this.setState({player2})
    console.log('player2: ',player2)
    const player3 = await token.methods.getPlayer3().call()
    this.setState({player3})
    console.log('player3: ',player3)
    if(this.state.player1 !== '0x0'){
        web3.eth.sendTransaction({
        from: this.state.player1,
        to: this.state.account,
        value: web3.utils.toWei('1', 'ether')
      })
    }
    if(this.state.player2 !== '0x0'){
      web3.eth.sendTransaction({
      from: this.state.player2,
      to: this.state.account,
      value: web3.utils.toWei('1', 'ether')
    })
  }
  if(this.state.player3 !== '0x0'){
    web3.eth.sendTransaction({
    from: this.state.player3,
    to: this.state.account,
    value: web3.utils.toWei('1', 'ether')
  })
}
    
    const winner = await token.methods.pickWinner().call()
    this.setState({ winner })
    console.log( 'winner: ', winner )

    const totalSupply = await token.methods.totalSupply().call()
    this.setState({ totalSupply })

    let balanceOf = await token.methods.balanceOf(this.state.winner).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(this.state.winner, i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    
  }

  

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      token: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: [],
      player1: '0x0',
      player2: '0x0',
      player3: '0x0',
      winner: '0x0',
    }
    this.setPlayer1 = this.setPlayer1.bind(this)
    this.setPlayer2 = this.setPlayer2.bind(this)
    this.setPlayer3 = this.setPlayer3.bind(this)
    //this.payOwner = this.payOwner.bind(this)
  }

  setPlayer1(addr) {
    this.state.token.methods.setPlayer1(addr).send({ from: this.state.account, gas: '1000000' })
  }
  setPlayer2(addr) {
    this.state.token.methods.setPlayer2(addr).send({ from: this.state.account, gas: '1000000' })
  }
  setPlayer3(addr) {
    this.state.token.methods.setPlayer3(addr).send({ from: this.state.account, gas: '1000000' })
  }

  /*async payOwner(addr) {
    Web3.eth.sendTransaction({
      from: addr,
      to: this.state.account,
      value: 100000
    })
  }*/
  
  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if(this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId === optionTwoId) {
      alert('You have clicked the same image!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match')
      this.state.token.methods.mint(
        this.state.winner,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: this.state.account, gas: '1000000' })
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
          tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
        })
      })
    } else {
      alert('Sorry, try again')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
      alert('Congratulations! You found them all!')
    }
  }

  render() {
    return (
      <div className="topdiv">
        <div className="item header">
            <h1>hi</h1>
        </div>
        <div className="inout">
        <InputOutput setPlayer1 = {this.setPlayer1} setPlayer2 = {this.setPlayer2} setPlayer3 = {this.setPlayer3}/>
        <p>Winner : {this.state.winner}</p>
        </div>
      <div className='bottomdiv'>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1 className="d-4">Start matching now!</h1>

                <div className="grid mb-4" >

                { this.state.cardArray.map((card, key) => {
                    return(
                      <img
                        key={key}
                        src={this.chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if(!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />
                    )
                  })}

                </div>

                <div>

                <h5>Tokens Collected:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>

                  <div className="grid mb-4" >

                  { this.state.tokenURIs.map((tokenURI, key) => {
                      return(
                        <img
                          key={key}
                          src={tokenURI}
                        />
                      )
                  })}


                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
        </div>
        
      </div>
      


      
    
    
    );
  }
}

export default App;