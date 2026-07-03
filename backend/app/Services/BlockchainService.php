<?php

namespace App\Services;

use Web3\Web3;
use Web3\Contract;
use Web3\Providers\HttpProvider;
use Web3\RequestManagers\HttpRequestManager;
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
        $rpcUrl = env('RPC_URL', 'http://localhost:8545');
        $this->contractAddress = env('CONTRACT_ADDRESS');
        $this->relayerPrivateKey = env('RELAYER_PRIVATE_KEY');
        
        // Clean private key if it has 0x prefix
        if (str_starts_with($this->relayerPrivateKey, '0x')) {
            $this->relayerPrivateKey = substr($this->relayerPrivateKey, 2);
        }

        $this->web3 = new Web3(new HttpProvider(new HttpRequestManager($rpcUrl, 5)));
        
        // This ABI should match your Voteria smart contract's castVote function.
        // It assumes standard Groth16 verify parameters (a, b, c, input) + candidateId + nullifierHash
        $this->abi = '[{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"},{"internalType":"uint256","name":"candidateId","type":"uint256"},{"internalType":"uint256","name":"nullifierHash","type":"uint256"}],"name":"castVote","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
    }

    /**
     * Casts a vote to the blockchain via the relayer account
     */
    public function castVote($proof, $candidateId, $nullifierHash)
    {
        $contract = new Contract($this->web3->provider, $this->abi);
        $contract->at($this->contractAddress);

        // Extract ZKP params
        $pA = $proof['a'];
        $pB = $proof['b'];
        $pC = $proof['c'];
        $pubSignals = $proof['inputs'] ?? []; // Adjust based on your proof format

        // 1. Encode ABI data
        $data = $contract->getData('castVote', $pA, $pB, $pC, $pubSignals, $candidateId, $nullifierHash);

        // 2. Get Relayer Address from Private Key (or configure it in env)
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
        // You may need to estimate gas, here we use a fixed gas limit for simplicity
        $transaction = new Transaction([
            'nonce' => '0x' . $nonce->toHex(),
            'gas' => '0x' . dechex(3000000), // Adjust gas limit as needed
            'gasPrice' => '0x' . $gasPrice->toHex(),
            'data' => '0x' . $data,
            'to' => $this->contractAddress,
            'chainId' => env('CHAIN_ID', 1337) // 1337 for local Hardhat
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
}
