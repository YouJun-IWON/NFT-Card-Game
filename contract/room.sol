// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// Crowdsale contract for BAYToken
contract Room {
    address public owner;
    address public admin;
    address public guest;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        owner = msg.sender;
    }

    function game_end(address winner) external onlyOwner{
        payable(winner).transfer(address(this).balance);
    }

    function get_balance() external view returns (uint256) {
        return address(this).balance;
    }

    function get_admin() external view returns (address) {
        return admin;
    }

    function get_guest() external view returns (address) {
        return guest;
    }

    event Received(address sender, uint amount);

    // 생성자, 기타 함수 등 다른 컨트랙트 내용

    receive() external payable {
        // 받은 이더의 양과 보낸 주소를 이벤트로 기록합니다.
        emit Received(msg.sender, msg.value);
    }

}
