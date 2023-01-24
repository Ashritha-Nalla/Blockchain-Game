//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;
import "./ERC721Full.sol";

contract MemoryToken is ERC721Full  {
    address public player1;
    address public player2;
    address public player3;
    string public str1;
    string public str2;
    string public str3;

    address payable public admin;
    //uint public count;
    address public p;
    address public winner;
    uint public w;
    uint public randWinner;

    constructor() ERC721Full("Memory Token", "MEMORY") public {
        admin = msg.sender;
    }

     modifier onlyOwner() {
        require(admin == msg.sender, "You are not the owner");
        _;
    }
    
    function getPlayer1() public view returns (address){
        return player1;
    }
    function getPlayer2() public view returns (address){
        return player2;
    }
    function getPlayer3() public view returns (address){
        return player3; 
    }

    function setPlayer1(string memory j) public {
        str1=j;
        p = parseAddr(str1);
        player1 = p;   
    }
    function setPlayer2(string memory j) public {
        str2=j;
        p = parseAddr(str2);
        player2 = p;   
    }
    function setPlayer3(string memory j) public {
        str3=j;
        p = parseAddr(str3);
        player3 = p;   
    }


    function() external payable{}

    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }
    
    function random() internal view returns(uint){
       return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, uint(3) )));
    }


    function pickWinner() public onlyOwner returns(address){

        randWinner = random() % 3;
        if(randWinner == 0){
            winner = player1;
        }else if(randWinner == 1){
            winner = player2;
        }else{
            winner = player3;
        }
        return (winner);
    }
    

    function mint(address _to, string memory _tokenURI) public returns(bool) {
       uint _tokenId = totalSupply().add(1);
       _mint(_to, _tokenId);
       _setTokenURI(_tokenId, _tokenURI);
       return true;
    }
}