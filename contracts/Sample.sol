pragma solidity ^0.5.8;

import 'Ownable.sol';

 // Sample contract for testing purpose
 // Author: Vu Duy Tuan - tuanvd@gmail.com
 // Date: 5/31/19
 // ime: 10:00 AM


contract TradeRecorder is Ownable {
    struct TradeRecord {
        string baseCCY;
        string quoteCCY;
        uint16 volume;
    }

    event RecordTrade(string orderId, string baseCCY, string quoteCCY, uint16 volume);

    // Account info
    uint256 accountId;
    string name;

    // Trade records
    mapping(string => TradeRecord) tradeLog;
    // Records for trade existing checking
    mapping(string => bool) tradeExisting;

    constructor(uint256 _accountId, string memory _name) public{
        accountId = _accountId;
        name = _name;
    }

    function getAccountId() public view returns (uint256){
        return accountId;
    }

    function getName() public view returns (string memory){
        return name;
    }

    function recordTrade(string memory _orderId, string memory _baseCCY, string memory _quoteCCY, uint16 _volume) public onlyOwner returns (bool){
        require(_volume != 0 && !tradeExisting[_orderId]);
        TradeRecord memory tr = TradeRecord({
            baseCCY : _baseCCY,
            quoteCCY : _quoteCCY,
            volume : _volume
            });
        tradeLog[_orderId] = tr;
        tradeExisting[_orderId] = true;
        emit RecordTrade(_orderId, _baseCCY, _quoteCCY, _volume);
        return true;
    }

    function getTradeRecord(string memory _orderId) public onlyOwner returns (string memory, string memory, uint16){
        if (tradeExisting[_orderId]) {
            TradeRecord memory record = tradeLog[_orderId];
            return (record.baseCCY, record.quoteCCY, record.volume);
        } else {
            return ("", "", 0);
        }

    }

}
