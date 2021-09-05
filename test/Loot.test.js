const { expect } = require("chai");

describe("Gear contract", function () {
    let calcInstance = null;

    beforeEach(async () => {
        const Gear = await ethers.getContractFactory("Gear");
        gearInstance = await Gear.deploy();
    });
});
