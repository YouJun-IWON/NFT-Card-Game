// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./room.sol" ;
// Crowdsale contract for BAYToken
contract Home {
    address public owner;
    mapping(Room => address[2]) public rooms;
    address[] public room_;
    bool public success;

    constructor() payable{
        owner = msg.sender;
    }

    event Room_address(address room_address);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function create_game() external payable returns (address) {
        Room room = new Room(msg.sender);
        rooms[room] = [msg.sender, address(0)]; // 0_index - > admin : 1_index -> guest
        //payable(address(room)).transfer(msg.value); // 실패 시 revert
        room_.push(address(room));
        (bool _success, ) = payable(address(room)).call{value: msg.value}("");
        success = _success;
        emit Room_address(address(room));
        return address(room);
        // (bool sent, ) = msg.sender.call.value(_amount)(""); // 송금 실패 시 false 반환
    }


    function join_game(address _room) external payable {
        Room room = Room(payable(_room));
        rooms[room][1] = msg.sender;
        (bool _success, ) = payable(address(room)).call{value: msg.value}("");
        success = _success;
        //payable(address(room)).transfer(msg.value); // 실패 시 revert
    }

    function deposit(address _room) external {
        (bool _success, ) = payable(_room).call{value: 1e18}("");
        success = _success;
    }

    function end_game( address _room , address _winner) external {
        Room room = Room(payable(_room));
        room.game_end(_winner);
    }

    function get_balance() external view returns (uint256) {
        return address(this).balance;
    }

 
}
