'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class VoteWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, numberOfTxs, systemContext, sutAdapter) {
        this.workerIndex = workerIndex;
        this.totalWorkers = totalWorkers;
        this.numberOfTxs = numberOfTxs;
        this.systemContext = systemContext;
        this.sutAdapter = sutAdapter;
        
        this.web3 = this.systemContext.web3;
        this.contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
        
        const abi = [{"inputs":[],"name":"currentMerkleRoot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
        try {
            this.currentRoot = await this.contract.methods.currentMerkleRoot().call();
        } catch (e) {
            this.currentRoot = "0";
        }
    }

    async submitTransaction() {
        const randomNullifier = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const candidateId = Math.random() > 0.5 ? 1 : 2;
        
        const a = ["0x" + "1".repeat(64), "0x" + "2".repeat(64)];
        const b = [
            ["0x" + "3".repeat(64), "0x" + "4".repeat(64)],
            ["0x" + "5".repeat(64), "0x" + "6".repeat(64)]
        ];
        const c = ["0x" + "7".repeat(64), "0x" + "8".repeat(64)];
        const input = [this.currentRoot || "0"];

        const txArgs = {
            contract: 'Evoting',
            verb: 'castVote',
            args: [a, b, c, input, candidateId, randomNullifier],
            readOnly: false
        };

        await this.sutAdapter.sendRequests(txArgs);
    }

    async cleanupWorkloadModule() {
        // No cleanup
    }
}

function createWorkloadModule() {
    return new VoteWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
