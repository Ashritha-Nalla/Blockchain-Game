import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import InputOutput from './InputOutput'
import Footer from './Footer'
//import img1 from 'src\imagesOfFrontEnd\img1.jpg'

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
      w: 0,
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

        <div className="navbar-container" style={{paddingTop:"0px"}}>
        <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#cc7733"}}>
        <a className="navbar-brand" style={{fontFamily: "'Raleway', cursive",fontSize:"3rem"}}><span style={{color:"#553311"}}>Lucky Draw</span></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto" style={{textAlign:"center"}}>
            <li className="nav-item active">
              <a className="nav-link" href="#AboutGame" ><button type="button" className="nav-button">About</button> <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#bottom-section-contact" ><button type="button" className="nav-button">Contact</button></a>
            </li>
          </ul>
          </div>
        </nav>
        </div>

        <div className='marginnew'>

        
        
        <div id='AboutGame'> 
            <div className='AboutGame1'>
              <h2>
                Introduction : 
              </h2><br/>
              <div className='AboutGame2'>
              <p>
                This is a blockchain multiplayer game which runs on Ethereum Blockchain 
              
                connected to local blockchain ganache.The players need to pay certain 
              
                amount of ethers to enter the lucky draw game. The winner is choosen  
              
                randomly who gets to collects tokens by playing memory game. 
              
              </p>
              </div>
              
            </div> 
        </div>
        <div className='gifnew'></div>
        
        <div id='AboutGameRules'>
            <div className='AboutGameRules'>
            <h2>
              Are you ready to play the game of luck?
            </h2><br/>
            <h3>The following steps are to be followed :</h3>
            <h4>1. Choose your account from the ganache local blockchain</h4>
            <h4>2. Enter the account address in one of the player addresses</h4>
            <h4>3. Click Pay! button to pay 1 ether to enter the game</h4>
            <h4>4. Stick back and relax while the blockchain gives out the winner</h4>
            <h4>5. The winner gets to collect the tokens by playing the memory game below
            </h4><br/>
            </div> 
        </div>

        <div className='gifnew2'></div>

        <div className="item header1">
            <h2><center>Test Your Luck!</center></h2>
        </div>
        <div className="inout">
          <center>
        	<InputOutput setPlayer1 = {this.setPlayer1} setPlayer2 = {this.setPlayer2} setPlayer3 = {this.setPlayer3}/>
          </center>
        </div>
        <div className="item header2">
          <div className = 'box'>
            <h2><center>Winner is the player with address :   </center></h2>
            <h5><center><i>{this.state.winner}</i></center></h5>
          </div>
        </div>
      
      
      
      <div id='AboutGame4'> 
            <div className='AboutGame5'>
              <h2>
                Collection of tokens : 
              </h2><br/>
              <div className='AboutGame6'>
              <p>
                The winner is awarded with Non-Fungible Tokens.<br/>
                These Non-Fungible Tokens are added to the winner's account.<br/>
                These tokens can be collected by playing the following game.<br/>
                <br/>
                The instructions to be followed to collect the tokens are:<br/>
                1. The grid consists of tokens which are in pairs.<br/> 
                2. The player can view two tokens at a time by clicking on the grid.<br/>
                3. The player has to remember the placement of the tokens and match <br/>them to collect.
              </p>
            </div>
              <div className='icon-arrow'></div>
            </div> 
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
        <div className='lastFooter'>
              <Footer ></Footer>
        </div>
      </div>

      
      
    );
  }
}

export default App;