const { assert } = require("chai");
describe('SidekickInterface', function () {
    let sidekick, hero;
    beforeEach(async () => {
        const Sidekick = await ethers.getContractFactory("SidekickInterface");
        sidekick = await Sidekick.deploy();

        const Hero = await ethers.getContractFactory("Hero");
        hero = await Hero.deploy();

        await sidekick.sendAlert(hero.address);
    });

    it('should have alerted the hero', async () => {
        const alerted = await hero.alerted.call();
        assert.equal(alerted, true);
    });
});

describe('SidekickManual', function () {
    let sidekick, hero;
    beforeEach(async () => {
        const Sidekick = await ethers.getContractFactory("SidekickManual");
        sidekick = await Sidekick.deploy();

        const Hero = await ethers.getContractFactory("Hero");
        hero = await Hero.deploy();

        await sidekick.sendAlert(hero.address);
    });

    it('should have alerted the hero', async () => {
        const alerted = await hero.alerted.call();
        assert.equal(alerted, true);
    });
});

describe("SidekickSig", () => {
    let hero, sidekick;
    before(async () => {
        const Hero = await ethers.getContractFactory("HeroSig");
        hero = await Hero.deploy();

        const Sidekick = await ethers.getContractFactory("SidekickSig");
        sidekick = await Sidekick.deploy();
    });

    describe("after sending the alert", () => {
        before(async () => {
            await sidekick.sendAlert(hero.address, 5, true);
        });

        it("should have the sidekick alert the hero", async () => {
            const ambush = await hero.ambush();

            assert(ambush.alerted);
            assert.equal(ambush.enemies, 5);
            assert.equal(ambush.armed, true);
        });
    });
});

describe('SidekickRelay', function () {
    let sidekick, hero;
    beforeEach(async () => {
        const Sidekick = await ethers.getContractFactory("SidekickRelay");
        sidekick = await Sidekick.deploy();

        const Hero = await ethers.getContractFactory("HeroSig");
        hero = await Hero.deploy();

        const calldata = hero.interface.encodeFunctionData('alert', [5, true]);
        await sidekick.relay(hero.address, calldata);
    });

    it("should have the sidekick alert the hero", async () => {
        const ambush = await hero.ambush();

        assert(ambush.alerted);
        assert.equal(ambush.enemies, 5);
        assert.equal(ambush.armed, true);
    });
});

describe("SidekickFallback", () => {
    let hero, sidekick;
    before(async () => {
        const Hero = await ethers.getContractFactory("HeroSig");
        hero = await Hero.deploy();

        const Sidekick = await ethers.getContractFactory("SidekickFallback");
        sidekick = await Sidekick.deploy();
    });

    describe("after sending the alert", () => {
        before(async () => {
            await sidekick.makeContact(hero.address);
        });

        it("should update the last contract", async () => {
            const lastContact = await hero.lastContact();

            assert.notEqual(lastContact.toNumber(), 0);
        });
    });
});

