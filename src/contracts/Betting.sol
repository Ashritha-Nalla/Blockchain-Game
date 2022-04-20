// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

contract Betting {
    address payable[] public players;
    address payable public admin;
    uint[] public bet;

    constructor() public{
        admin = msg.sender;
    }

    modifier onlyOwner() {
        require(admin == msg.sender, "You are not the owner");
        _;
    }

    function receive() external payable {
        require(msg.value == 1 ether , "Must send 1 ether amount");
        
        require(msg.sender != admin, "Admin cannot participate in the Game");
        
        players.push(msg.sender);    
    }
    
    function addData(uint num) public{
        require(num >= 1, 'Accept only values above 1');
        require(num <= 6, 'Accept only values below 6');
        require(bet.length <= players.length-1, "Each player can give only one number as a bet");
        bet.push(num);
    }

    function getBet() public view returns(uint[] memory){
        return bet;
    }

    function getBalance() public view onlyOwner returns(uint){
        return address(this).balance;
    }

    function random() internal view returns(uint){
        uint res = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length))) % 6;
        if(res == 0){
             res = 1;
        }
       return res;
    }

    function pickWinner() public onlyOwner {

        require(players.length >= 3 , "Minimum 3 players are required to participate to conduct the Game");
        
        address payable winner;
        uint randNum = random();
        uint i=0;
        for(i=0; i<players.length; i++){
            if(randNum == bet[i]){
                break;
            }
        }
        
        if(i < players.length){
            winner = players[i];
            winner.transfer(getBalance());
        }else{
            admin.transfer(getBalance());
        }
        
    }
    
}