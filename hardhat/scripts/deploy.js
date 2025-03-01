const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    try {
        // Deploy Token
        const Token = await ethers.getContractFactory("MuriaticToken");
        console.log("Deploying token contract...");
        const initialSupply = 1000000; // 1 million tokens
        const token = await Token.deploy(initialSupply);
        
        // Wait for deployment
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();
        console.log("Token deployed to:", tokenAddress);
        
        // Deploy Staking
        const Staking = await ethers.getContractFactory("Staking");
        const staking = await Staking.deploy(tokenAddress);
        await staking.waitForDeployment();
        const stakingAddress = await staking.getAddress();
        console.log("Staking deployed to:", stakingAddress);

        // Deploy Lock
        const Lock = await ethers.getContractFactory("Lock");
        const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week from now
        //const lock = await Lock.deploy(unlockTime, { value: ethers.parseEther("0.1") }); // Lock 1 Ether for 1 week
        //await lock.waitForDeployment();
        //const lockAddress = await lock.getAddress();
        //console.log("Lock contract deployed to:", lockAddress);
        
       
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });