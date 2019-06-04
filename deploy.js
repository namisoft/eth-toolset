/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/29/19
 * Time: 10:04 AM
 */
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const Web3 = require('web3');

const argv = require('minimist')(process.argv.slice(2));

if (argv['contract'] === undefined || argv['contract'] === null) {
    console.log('Undefined contract');
    process.exit();
}

const contractName = argv['contract'];

let networkId = 'default';
if (argv['network'] !== undefined && argv['network'] !== null) {
    networkId = argv['network'];
}
if (config.networks[networkId] === undefined || config.networks[networkId] === null) {
    console.log('Undefined network');
    process.exit();
}
const networkConfig = config.networks[networkId];

let params = [];
if (argv['params'] !== undefined && argv['params'] !== null) {
    params = JSON.parse(argv['params']);
}

const builtContractPath = path.resolve(__dirname, config.builtContractPath, `${contractName}.json`);
const {abi, bytecode} = fs.readJsonSync(builtContractPath);

if (abi && bytecode) {
    console.log(`Used contract def file: ${builtContractPath}`);
} else {
    console.log(`Invalid contract def file: ${builtContractPath}`);
    process.exit();
}

console.log(`Used network provider: ${networkConfig['url']}`);

const web3 = new Web3(networkConfig['url']);
//web3.eth.accounts.wallet.add(networkConfig.defaultAccount.privateKey);
web3.eth.accounts.wallet.add({
    address: networkConfig.defaultAccount.address,
    privateKey: networkConfig.defaultAccount.privateKey
});
const contract = new web3.eth.Contract(abi);
contract
    .deploy({data: bytecode, arguments: params})
    .send({from: networkConfig.defaultAccount.address, gas: networkConfig.gas})
    .on('receipt', function (receipt) {
        console.log(`Contract ${contractName} deployed successfully`);
        console.log('   address: ' + receipt.contractAddress);
        console.log('   txn: ' + receipt.transactionHash);
        // Save deployment info
        const deployedContractPath = path.resolve(__dirname, config.deployedContractPath, `${contractName}_${networkId}.json`);
        fs.removeSync(deployedContractPath);
        fs.outputJsonSync(
            deployedContractPath,
            {
                contractName: contractName,
                networkId: networkId,
                contractAddress: receipt.contractAddress,
                transactionIndex: receipt.transactionIndex,
                blockHash: receipt.blockHash,
                blockNumber: receipt.blockNumber,
                cumulativeGasUsed: receipt.cumulativeGasUsed,
                gasUsed: receipt.gasUsed,
                transactionHash: receipt.transactionHash,
                abi: abi
            }
        );
        console.log(`Deployment info saved to ${deployedContractPath}`);
        process.exit();
    })
    .on('error', function (error) {
        console.log('Error on creating contract: ' + error);
        process.exit();
    });