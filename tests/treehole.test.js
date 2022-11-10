const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreeHole", function () {
  it("test get unexist post", async function () {
    const TreeHole = await ethers.getContractFactory("TreeHole");
    const hole = await TreeHole.deploy();
    await hole.deployed();
    
    console.log("TreeHole deployed at"+ hole.address)

    expect(hole.get(Date.now(), 1)).to.be.revertedWith("This Srecret Must From Future.");
  });
  it("test empty post", async function () {
    const TreeHole = await ethers.getContractFactory("TreeHole");
    const hole = await TreeHole.deploy();
    await hole.deployed();

    const str = "";

    expect(await hole.post(str)).to.be.revertedWith("The Length Of The Secret Should Smaller and Equal to 32 bits.");
  });
  it("test post more than 32 bits", async function () {
    const TreeHole = await ethers.getContractFactory("TreeHole");
    const hole = await TreeHole.deploy();
    await hole.deployed();

    const str = "1234567890123456789012345678901234567890";

    expect(await hole.post(str)).to.be.revertedWith("The Length Of The Secret Should Smaller and Equal to 32 bits.");
  });
  it("test post and emit event log", async function () {
    const TreeHole = await ethers.getContractFactory("TreeHole");
    const hole = await TreeHole.deploy();
    await hole.deployed();

    const str = "Hi!";
    const timestamp = Date.now();

    expect(await hole.post(str)).to.emit(hole, "postLog").withArgs(timestamp, 1);
  });
});
