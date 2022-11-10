// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TreeHole {

    struct TimeStamp {
        uint timestamp;
        uint id;
    }

    // mapping timestamp w/ Holes
    mapping(uint => uint) secretMapLen;
    mapping(uint => mapping(uint => string)) secretMap;
    mapping(string => uint) tagMapLen;
    mapping(string => TimeStamp[]) tagMap;
    event postLog(uint indexed timestamp, uint indexed id);
    event display(string tag);
    event insertTag(string tag);

    // split words by space and make words as tags
    function addTag(string memory words, uint timestamp, uint id) public {

        bytes memory byteWords = bytes(words);
        bytes memory tmp = new bytes(byteWords.length);

        uint j = 0;
        for(uint i = 0; i < byteWords.length; i++) {
            if (byteWords[i] != " " || byteWords[i] != ",") {
                // tmp[j++] = byteWords[i];
                assembly { mstore(add(tmp, j), mload(add(byteWords, i))) }
                emit display(string(tmp));
            }
            else {
                string memory str = string(tmp);

                emit insertTag(str);

                ++tagMapLen[str];
                tagMap[str].push(TimeStamp({ timestamp: timestamp, id: id }));
                tmp = "";
                j = 0;
            }
        }
    }

    function post(string memory words) public {
        
        // TODO: truncate words to 32, if it is longer than 32 bits
        require(bytes(words).length > 0 && bytes(words).length <= 32,
                "The Length Of The Secret Should Smaller and Equal to 32 bits.");

        uint timestamp = block.timestamp;
        ++secretMapLen[timestamp];
        secretMap[timestamp][secretMapLen[timestamp]] = words;

        // addTag(words, timestamp, secretMapLen[timestamp]);

        emit postLog(timestamp, secretMapLen[timestamp]);
    }

    function getMapLen(uint timestamp) public view returns (uint) {
        return secretMapLen[timestamp];
    }

    function get(uint timestamp, uint id) public view returns (string memory) {

        require(id > 0 && id <= secretMapLen[timestamp], "The Secret ID Is NOT Exist!");

        return secretMap[timestamp][id];
    }

    function search(string calldata str) public view returns (TimeStamp[] memory) {
        return tagMap[str];
    }
}
