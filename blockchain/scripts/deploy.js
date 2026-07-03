const hre = require("hardhat");

async function main() {
  console.log("Starting deployment on custom PBFT network...");

  // 1. Deploy Verifier Contract
  console.log("Deploying Verifier...");
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log(`Verifier deployed to: ${verifierAddress}`);

  // 2. Deploy Evoting Contract
  console.log("Deploying Evoting...");
  const Evoting = await hre.ethers.getContractFactory("Evoting");
  const evoting = await Evoting.deploy(verifierAddress);
  await evoting.waitForDeployment();
  const evotingAddress = await evoting.getAddress();
  console.log(`Evoting deployed to: ${evotingAddress}`);

  console.log("\nDeployment completed successfully!");
  console.log("------------------------------------");
  console.log(`Verifier Address: ${verifierAddress}`);
  console.log(`Evoting Address:  ${evotingAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
