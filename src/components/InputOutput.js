import React, { Component } from 'react'

class InputOutput extends Component {
    
    render(){
        return(
            <div className="item item1">
            <div className="login-form">
              <h1>Lucky Draw</h1>
              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.setPlayer1(this.playerAddress1.value)
              }} >
                  <br></br>
                  <h4>Player 1 address</h4>
                  <input
                    id="player-address1"
                    type="text"
                    ref={(input) =>  this.playerAddress1 = input }
                    className="form-control"
                    placeholder="Account address of the player1 to be played..."
                    required />
                  
                  <button className= "button1" type="submit" >Pay!</button>  
              </form>

              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.setPlayer2(this.playerAddress2.value)
              }} >
                  <br></br>
                  <h4>Player 2 address</h4>
                  <input
                    id="player-address2"
                    type="text"
                    ref={(input) =>  this.playerAddress2 = input }
                    className="form-control"
                    placeholder="Account address of the player2 to be played..."
                    required />
                  
                  <button className= "button1"type="submit" >Pay!</button>  
              </form>

              <form onSubmit={(event) => {
                event.preventDefault()
                this.props.setPlayer3(this.playerAddress3.value)
              }} >
                  <br></br>
                  <h4>Player 3 address</h4>
                  <input
                    id="player-address3"
                    type="text"
                    ref={(input) =>  this.playerAddress3 = input }
                    className="form-control"
                    placeholder="Account address of the player3 to be played..."
                    required />
                  
                  <button className= "button1" type="submit" >Pay!</button>  
              </form>
            </div>

            </div>
        )
    }
}

export default InputOutput;