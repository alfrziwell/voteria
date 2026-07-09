const { ethers } = require("hardhat");

async function main() {
    console.log("==========================================");
    console.log("    Voteria PBFT Stress Testing Client    ");
    console.log("==========================================\n");

    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const Evoting = await ethers.getContractAt("Evoting", contractAddress);
    
    const currentRoot = await Evoting.currentMerkleRoot();
    console.log(`Connected to Evoting Contract: ${contractAddress}`);
    console.log(`Current Merkle Root: ${currentRoot.toString()}\n`);

    const totalTransactions = 100; 
    const tpsTarget = 20;          
    const intervalMs = 1000 / tpsTarget;

    console.log(`Starting stress test:`);
    console.log(`- Total transactions to send: ${totalTransactions}`);
    console.log(`- Target Send Rate: ${tpsTarget} TPS\n`);

    const startTestTime = Date.now();
    const latencies = [];
    let successfulTx = 0;
    let failedTx = 0;

    const promises = [];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < totalTransactions; i++) {
        const candidateId = Math.random() > 0.5 ? 1 : 2;
        const randomNullifier = ethers.toBigInt(ethers.randomBytes(32));

        const a = [ethers.ZeroHash, ethers.ZeroHash];
        const b = [
            [ethers.ZeroHash, ethers.ZeroHash],
            [ethers.ZeroHash, ethers.ZeroHash]
        ];
        const c = [ethers.ZeroHash, ethers.ZeroHash];
        const input = [currentRoot];

        const sendTime = Date.now();
        
        const txPromise = Evoting.castVote(a, b, c, input, candidateId, randomNullifier)
            .then(async (tx) => {
                const receipt = await tx.wait();
                const mineTime = Date.now();
                const latency = (mineTime - sendTime) / 1000; 
                latencies.push(latency);
                successfulTx++;
                process.stdout.write("✓");
            })
            .catch((err) => {
                failedTx++;
                process.stdout.write("✗");
            });

        promises.push(txPromise);
        await sleep(intervalMs);
    }

    console.log("\n\nAll transactions sent. Waiting for confirmations...");
    await Promise.all(promises);
    const endTestTime = Date.now();

    const duration = (endTestTime - startTestTime) / 1000;
    const actualTps = (successfulTx + failedTx) / duration;

    const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0;
    const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
    const avgLatency = latencies.length > 0 ? (latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

    console.log("\n==========================================");
    console.log("              TEST RESULTS                ");
    console.log("==========================================");
    console.log(`Total Duration:      ${duration.toFixed(2)} seconds`);
    console.log(`Total Sent:          ${totalTransactions}`);
    console.log(`Successful:          ${successfulTx} (${((successfulTx/totalTransactions)*100).toFixed(1)}%)`);
    console.log(`Failed:              ${failedTx}`);
    console.log(`Actual Send Rate:    ${actualTps.toFixed(2)} TPS`);
    console.log(`Throughput (TPS):    ${(successfulTx / duration).toFixed(2)} TPS`);
    console.log(`Min Latency:         ${minLatency.toFixed(3)} seconds`);
    console.log(`Max Latency:         ${maxLatency.toFixed(3)} seconds`);
    console.log(`Average Latency:     ${avgLatency.toFixed(3)} seconds`);
    console.log("==========================================\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
