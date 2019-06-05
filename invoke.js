/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 6/5/19
 * Time: 10:48 AM
 */
const Web3 = require('web3');
const fs = require('fs-extra');
const path = require('path');

const config = require('./config');

const argv = require('minimist')(process.argv.slice(2));

const contractName = argv['contract'];
if (contractName === undefined || contractName === null) {
    console.log('Undefined contract');
    process.exit();
}

const methodName = argv['method'];
if (methodName === undefined || methodName === null) {
    console.log('Undefined method');
    process.exit();
}

const verb = argv['verb'];
if (verb !== 'call' && verb !== 'send') {
    console.log('Undefined or unsupported verb');
    process.exit();
}

let params = [];
if (argv['params'] !== undefined && argv['params'] !== null) {
    try {
        params = JSON.parse(argv['params']);
    }catch(err){
        console.log(`Invalid input params: ${err.toString()}`);
        process.exit();
    }
}

let networkId = 'default';
if (argv['network'] !== undefined && argv['network'] !== null) {
    networkId = argv['network'];
}
if (!config.networks[networkId]) {
    console.log('Undefined network');
    process.exit();
}
const networkConfig = config.networks[networkId];

// Load deployed contract info
const deployedContractInfoFile = path.resolve(__dirname, config.deployedContractPath, `${contractName}_${networkId}.json`);
const {abi, contractAddress} = fs.readJsonSync(deployedContractInfoFile);

if (abi && contractAddress) {
    console.log(`Used contract deployment info file: ${deployedContractInfoFile}`);
    console.log(`   Network: ${networkId} (url=${networkConfig['url']})`);
    console.log(`   Contract: ${contractName} (address=${contractAddress})`);
} else {
    console.log(`Invalid contract deployment info file: ${deployedContractInfoFile}`);
    process.exit();
}

// Create contract instance
const web3 = new Web3(networkConfig['url']);
web3.eth.accounts.wallet.add({
    address: networkConfig.defaultAccount.address,
    privateKey: networkConfig.defaultAccount.privateKey
});
const contract = new web3.eth.Contract(abi, contractAddress);

// Invoke method
if (verb === 'call') {
    // Invoke call
    try {
        contract.methods[methodName].apply(null, params).call({
            from: networkConfig.defaultAccount.address,
            gas: networkConfig.gas
        }).then(
            (result) => {
                console.log(`Invoke call method ${contractName}.${methodName} done`);
                console.log(`   Result: ${JSON.stringify(result)}`);
                process.exit();
            }
        ).catch((err) => {
            console.log(`Invoke call method ${contractName}.${methodName} failed: ${err.toString()}`);
            process.exit();
        })
    } catch (err) {
        console.log(`Invoke call method ${contractName}.${methodName} failed: ${err.toString()}`);
        process.exit();
    }
} else {
    // Invoke send
    try {
        contract.methods[methodName].apply(null, params)
            .send({
                from: networkConfig.defaultAccount.address,
                gas: networkConfig.gas
            })
            .on('transactionHash',
                (txHash) => {
                    console.log(`Invoke send method ${contractName}.${methodName} done`);
                    console.log(`   TxHash: ${JSON.stringify(txHash)}`);
                    process.exit();
                }
            )
            .catch((err) => {
                console.log(`Invoke call method ${contractName}.${methodName} failed: ${err.toString()}`);
                process.exit();
            })
    } catch (err) {
        console.log(`Invoke send method ${contractName}.${methodName} failed: ${err.toString()}`);
        process.exit();
    }
}
