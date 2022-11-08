// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TreeHole {

    // mapping timestamp w/ Holes
    uint mapLen;
    mapping(uint => string) map;
    // mapping(uint => uint) mapLen;
    // mapping(uint => mapping(uint => string)) map;

    // function post(bytes[] memory words) public {
    // function post(string memory words) public returns (uint, uint) {
        function post(string memory words) public returns (uint) {
        
        // TODO: truncate words to 32, if it longer than 32 bits
        require(bytes(words).length > 0 && bytes(words).length <= 32);

        map[++mapLen] = words;
        // uint timestamp = block.timestamp;
        // ++mapLen[timestamp];
        // map[timestamp][mapLen[timestamp]] = words;
        // emit logPost(timestamp, mapLen[timestamp]);

        return mapLen;
    }

    function get(uint id) public view returns (string memory) {
        return map[id];
    }

    // function get(uint timestamp, uint id) public view returns (string memory) {
    //     return map[timestamp][id];
    // }
}
