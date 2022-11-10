const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TreeHole", () => {
  describe("post", function () {
    it("test empty post", async function () {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str = "";

      expect(hole.post(str)).to.be.revertedWith("The Length Of The Secret Should Smaller and Equal to 32 bits.");
    });

    it("test post more than 32 bits", async function () {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str = "1234567890123456789012345678901234567890";

      expect(hole.post(str)).to.be.revertedWith("The Length Of The Secret Should Smaller and Equal to 32 bits.");
    });

    it("test one post", async function () {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str = "Hi!";
      const _timestamp = Math.round(Date.now() / 1000);
      const tx = await hole.post(str);
      const { logs } = await ethers.provider.getTransactionReceipt(tx.hash);
      const [ x, timestamp, id ] = logs[0].topics;

      expect(Number(timestamp)).to.equal(_timestamp);
      expect(Number(id)).to.equal(1);
    });

    it("test multiple posts", async function () {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str1 = "Hello, test1!";
      const str2 = "Hello, test2!";
      const str3 = "Hello, test3!";

      const tx1 = await hole.post(str1);
      const tx2 = await hole.post(str2);
      const tx3 = await hole.post(str3);

      const rec1 = await ethers.provider.getTransactionReceipt(tx1.hash);
      const [ x1, timestamp1, id1 ] = rec1.logs[0].topics;
      const rec2 = await ethers.provider.getTransactionReceipt(tx2.hash);
      const [ x2, timestamp2, id2 ] = rec2.logs[0].topics;
      const rec3 = await ethers.provider.getTransactionReceipt(tx3.hash);
      const [ x3, timestamp3, id3 ] = rec3.logs[0].topics;

      expect(Number(timestamp1)).to.equal(Number(timestamp2));
      expect(Number(id1)).to.equal(1);
      expect(Number(timestamp2)).to.equal(Number(timestamp3));
      expect(Number(id2)).to.equal(2);
      expect(Number(timestamp3)).to.equal(Number(timestamp1));
      expect(Number(id3)).to.equal(3);
    });
  }

  describe("getMapLen", () => {
    it("test zero post length", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      expect(await hole.getMapLen(Date.now())).to.equal(0);
    });

    it("test one post length", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str = "Hi!";
      const tx = await hole.post(str);
      const { logs } = await ethers.provider.getTransactionReceipt(tx.hash);
      const [ x, timestamp, id ] = logs[0].topics;

      expect(await hole.getMapLen(timestamp)).to.equal(1);
    });

    it("test multiple posts length", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str1 = "Hello, test1!";
      const str2 = "Hello, test2!";
      const str3 = "Hello, test3!";

      const timestamp = Date.now();
      const tx1 = await hole.post(str1);
      const tx2 = await hole.post(str2);
      const tx3 = await hole.post(str3);

      expect(await hole.getMapLen(timestamp)).to.equal(3);
    });
  });

  describe("get", () => {
    it("test get unexist post", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();
      
      console.log("TreeHole deployed at"+ hole.address)

      expect(hole.get(Date.now(), 1)).to.be.revertedWith("This Srecret Must From Future.");
    });

    it("test get one post", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str = "Hi!";
      const tx = await hole.post(str);
      const { logs } = await ethers.provider.getTransactionReceipt(tx.hash);
      const [ x, timestamp, id ] = logs[0].topics;

      expect(await hole.get(Number(timestamp), Number(id))).to.equal(str);
    });

    it("test get multiple posts", async () => {
      const TreeHole = await ethers.getContractFactory("TreeHole");
      const hole = await TreeHole.deploy();
      await hole.deployed();

      const str1 = "Hello, test1!";
      const str2 = "Hello, test2!";
      const str3 = "Hello, test3!";

      const tx1 = await hole.post(str1);
      const tx2 = await hole.post(str2);
      const tx3 = await hole.post(str3);

      const rec1 = await ethers.provider.getTransactionReceipt(tx1.hash);
      const [ x1, timestamp1, id1 ] = rec1.logs[0].topics;
      const rec2 = await ethers.provider.getTransactionReceipt(tx2.hash);
      const [ x2, timestamp2, id2 ] = rec2.logs[0].topics;
      const rec3 = await ethers.provider.getTransactionReceipt(tx3.hash);
      const [ x3, timestamp3, id3 ] = rec3.logs[0].topics;

      expect(await hole.get(Number(timestamp1), Number(id1))).to.equal(str1);
      expect(await hole.get(Number(timestamp2), Number(id2))).to.equal(str2);
      expect(await hole.get(Number(timestamp3), Number(id3))).to.equal(str3);
    });
  }
});
