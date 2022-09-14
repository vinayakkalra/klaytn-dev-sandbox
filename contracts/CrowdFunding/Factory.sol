// crowdfunding platform factory contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Project.sol";
import "@klaytn/contracts/access/Ownable.sol";
import "@klaytn/contracts/KIP/token/KIP7/IKIP7.sol";

contract Factory is Ownable {

    address[] public projects;
    address tokenAddress;
    uint256 projectFreeTokens;

    function createProject(uint256 _minimum, uint256 _target, string memory _projectURI) public  {
        require(_minimum >= 10**17, "Minimum should be more than 0.1 Klay");
        require(_minimum < _target, "Minimum should be less than the target");
        address newProject = address(new Project(_minimum, _target, _projectURI, msg.sender, tokenAddress));
        projects.push(newProject);
        IKIP7 tokenInterface = IKIP7(tokenAddress);
        if(tokenInterface.balanceOf(address(this)) >= projectFreeTokens){
            // IKIP7 projectInterface = IKIP7(tokenAddress);
            tokenInterface.transfer(newProject, projectFreeTokens);
        }
    }

    function getProjects() public view returns(address[] memory){
        return projects;
    }

    // set the value of the token that we will distribute to the investors for their good will
    function setTokenAddress(address _tokenAddress) public onlyOwner {
        tokenAddress = _tokenAddress;
    }

    function getTokenAddress() public view returns(address){
        return tokenAddress;
    }

    // function contributeToProject(address _project) public payable {
    //     Project(_project).contribute{value:msg.value}();

    // }

    function setFreeTokensPerProject(uint256 _amount) public onlyOwner {
        projectFreeTokens = _amount;
    }

    function getFreeTokensPerProject() public view returns(uint256){
        return projectFreeTokens;
    }

    // function to get the current token balance of project
    function getTokenBalance() public view returns(uint256){
        IKIP7 tokenInterface = IKIP7(tokenAddress);
        return tokenInterface.balanceOf(address(this));
    }

    // function to get token balance of any address (project/account)
    function getBalanceOfAccount(address _account) public view returns(uint256){
        IKIP7 tokenInterface = IKIP7(tokenAddress);
        return tokenInterface.balanceOf(_account);
    } 




}