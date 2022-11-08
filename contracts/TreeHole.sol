// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TreeHole {

    // mapping timestamp w/ Holes
    mapping(uint => uint) mapLen;
    mapping(uint => mapping(uint => string)) map;

    function post(string memory words) public {
        
        // TODO: truncate words to 32, if it longer than 32 bits
        require(bytes(words).length > 0 && bytes(words).length <= 32);

        uint timestamp = block.timestamp;
        ++mapLen[timestamp];
        map[timestamp][mapLen[timestamp]] = words;
    }

    function get(uint timestamp, uint id) public view returns (string memory) {
        return map[timestamp][id];
    }
}
