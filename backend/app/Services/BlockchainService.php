<?php

namespace App\Services;

use Web3\Web3;
use Web3\Contract;
use Web3\Providers\HttpProvider;
use kornrunner\Keccak;
use Web3p\EthereumTx\Transaction;

class BlockchainService
{
    protected $web3;
    protected $contractAddress;
    protected $relayerPrivateKey;
    protected $relayerAddress;
    protected $abi;

    public function __construct()
    {
        $rpcUrl = env('BLOCKCHAIN_RPC_URL', 'http://localhost:8545');
        $this->contractAddress = env('SMART_CONTRACT_ADDRESS');
        $this->relayerPrivateKey = env('RELAYER_PRIVATE_KEY');
        
        // Clean private key if it has 0x prefix
        if (str_starts_with($this->relayerPrivateKey, '0x')) {
            $this->relayerPrivateKey = substr($this->relayerPrivateKey, 2);
        }

        $this->web3 = new Web3(new HttpProvider($rpcUrl, 5));
        
        // This ABI should match your Voteria smart contract's functions.
        $this->abi = '[{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"},{"internalType":"uint256","name":"candidateId","type":"uint256"},{"internalType":"uint256","name":"nullifierHash","type":"uint256"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidateVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"toggleVotingStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_root","type":"uint256"}],"name":"setMerkleRoot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isVotingActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentMerkleRoot","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';
    }

    /**
     * Send signed transaction to the smart contract
     */
    protected function sendTransaction($method, ...$params)
    {
        $contract = new Contract($this->web3->provider, $this->abi);
        $contract->at($this->contractAddress);

        // 1. Encode ABI data
        $data = $contract->getData($method, ...$params);

        // 2. Get Relayer Address
        $relayerAddress = env('RELAYER_ADDRESS'); 

        // 3. Get Nonce
        $nonce = null;
        $this->web3->eth->getTransactionCount($relayerAddress, 'pending', function ($err, $result) use (&$nonce) {
            if ($err !== null) throw new \Exception('Failed to get nonce: ' . $err->getMessage());
            $nonce = $result;
        });

        // 4. Get Gas Price
        $gasPrice = null;
        $this->web3->eth->gasPrice(function ($err, $result) use (&$gasPrice) {
            if ($err !== null) throw new \Exception('Failed to get gas price: ' . $err->getMessage());
            $gasPrice = $result;
        });

        // 5. Construct Transaction
        $transaction = new Transaction([
            'nonce' => '0x' . $nonce->toHex(),
            'gas' => '0x' . dechex(3000000), 
            'gasPrice' => '0x' . $gasPrice->toHex(),
            'data' => '0x' . $data,
            'to' => $this->contractAddress,
            'chainId' => env('CHAIN_ID', 31337)
        ]);

        // 6. Sign Transaction
        $signedTx = $transaction->sign($this->relayerPrivateKey);

        // 7. Send Raw Transaction
        $txHash = null;
        $this->web3->eth->sendRawTransaction('0x' . $signedTx, function ($err, $result) use (&$txHash) {
            if ($err !== null) throw new \Exception('Failed to send transaction: ' . $err->getMessage());
            $txHash = $result;
        });

        return $txHash;
    }

    /**
     * Casts a vote to the blockchain via the relayer account
     */
    public function castVote($proof, $candidateId, $nullifierHash)
    {
        // Extract ZKP params
        $pA = $proof['a'];
        $pB = $proof['b'];
        $pC = $proof['c'];
        $pubSignals = $proof['inputs'] ?? [];

        // Normalize hex inputs (ensure 0x prefix is present for solidity uint256 parsing)
        foreach ($pubSignals as &$sig) {
            if (is_string($sig) && !str_starts_with($sig, '0x') && ctype_xdigit($sig)) {
                $sig = '0x' . $sig;
            }
        }
        if (is_string($nullifierHash) && !str_starts_with($nullifierHash, '0x') && ctype_xdigit($nullifierHash)) {
            $nullifierHash = '0x' . $nullifierHash;
        }

        return $this->sendTransaction('castVote', $pA, $pB, $pC, $pubSignals, $candidateId, $nullifierHash);
    }

    /**
     * Toggles voting status on the smart contract
     */
    public function toggleVotingStatus()
    {
        return $this->sendTransaction('toggleVotingStatus');
    }

    /**
     * Sets the Merkle Root on the smart contract
     */
    public function setMerkleRoot($root)
    {
        if (is_string($root) && !str_starts_with($root, '0x') && ctype_xdigit($root)) {
            $root = '0x' . $root;
        }
        return $this->sendTransaction('setMerkleRoot', $root);
    }

    /**
     * Check if voting is active in the smart contract
     */
    public function isVotingActive()
    {
        $contract = new Contract($this->web3->provider, $this->abi);
        $contract->at($this->contractAddress);

        $isActive = false;
        $contract->call('isVotingActive', function ($err, $result) use (&$isActive) {
            if ($err !== null) throw new \Exception('Failed to call isVotingActive: ' . $err->getMessage());
            if (isset($result[0])) {
                $isActive = (bool) $result[0];
            }
        });

        return $isActive;
    }

    /**
     * Check current Merkle Root in the smart contract
     */
    public function currentMerkleRoot()
    {
        $contract = new Contract($this->web3->provider, $this->abi);
        $contract->at($this->contractAddress);

        $root = '0';
        $contract->call('currentMerkleRoot', function ($err, $result) use (&$root) {
            if ($err !== null) throw new \Exception('Failed to call currentMerkleRoot: ' . $err->getMessage());
            if (isset($result[0])) {
                $root = $result[0]->toString();
            }
        });

        return $root;
    }

    /**
     * Get candidate votes count from the smart contract
     */
    public function getCandidateVotes($candidateId)
    {
        try {
            $contract = new Contract($this->web3->provider, $this->abi);
            $contract->at($this->contractAddress);

            $votes = 0;
            $contract->call('candidateVotes', $candidateId, function ($err, $result) use (&$votes) {
                if ($err !== null) throw new \Exception('Failed to call candidateVotes: ' . $err->getMessage());
                if (isset($result[0])) {
                    $votes = (int) $result[0]->toString();
                }
            });

            return $votes;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to get votes for candidate ' . $candidateId . ': ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Calculate and sync the current database Merkle Root to the blockchain smart contract
     */
    public function syncMerkleRoot()
    {
        try {
            $merkleTreeService = new \App\Services\MerkleTreeService();
            $tree = $merkleTreeService->buildTree();
            $height = (int) env('MERKLE_TREE_HEIGHT', 20);
            $root = $tree[$height][0] ?? null;

            if ($root) {
                if (!str_starts_with($root, '0x')) {
                    $root = '0x' . $root;
                }
                $this->setMerkleRoot($root);
                \Illuminate\Support\Facades\Log::info("Synced Merkle Root to blockchain: $root");
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to sync Merkle Root to blockchain: " . $e->getMessage());
        }
    }
}
