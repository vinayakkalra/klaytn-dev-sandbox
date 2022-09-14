// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FundingProject.sol";
import "@klaytn/contracts/access/Ownable.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";

contract Factory is Ownable {

    // create a child contract storage
    address[] public projects;
    address tokenAddress;
    uint256 freeTokensPerProject;


    function createProject(uint256 _minimum, uint256 _target, string memory _projectURI) public{
        Project project = new Project(_minimum, _target, _projectURI, msg.sender, tokenAddress);
        address projectId = address(project);
        projects.push(projectId);
        IKIP7 token = IKIP7(tokenAddress);
        if(token.balanceOf(address(this)) >= freeTokensPerProject){
            token.transfer(projectId, freeTokensPerProject);
        }

    }

    // returns all the child arrays
    function getProjects() public view returns(address[] memory){
        return projects;
    }

    // functions to set the value of tokenAddress
    function setTokenAddress(address _tokenAddress) public onlyOwner {
        tokenAddress = _tokenAddress;
    }

    function getTokenAddress() public view returns(address) {
        return tokenAddress;
    }

    // function to set the value of freeTokenPerProject
    function setFreetokenPerProject(uint256 _amount) public onlyOwner {
        freeTokensPerProject = _amount;
    }

    function getFreetokenPerProject() public view returns(uint256){
        return freeTokensPerProject;
    }

    // balance of token
    function getTokenbalance() public view returns(uint256){
        IKIP7 token = IKIP7(tokenAddress);
        return token.balanceOf(address(this));
    }

    function getTokenBalanceOfAddress(address _user) public view returns(uint256){
        IKIP7 token = IKIP7(tokenAddress);
        return token.balanceOf(_user);
    }
}