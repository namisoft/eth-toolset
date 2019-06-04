/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/27/19
 * Time: 10:46 AM
 */
module.exports = {
    contractSourcePath: 'contracts',
    builtContractPath: 'contracts/built',
    deployedContractPath: 'contracts/deployed',

    networks: {
        default: {
            url: "http://localhost:8545",
            defaultAccount: {
                address: '0x...',
                privateKey: '0x...'
            },
            gas: 6500000
        },
        dev: {
            url: "http://localhost:7545",
            defaultAccount: {
                address: '0x...',
                privateKey: '0x...'
            },
            gas: 6500000
        },
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/...",
            defaultAccount: {
                address: '0x...',
                privateKey: '0x...'
            },
            gas: 3000000
        },
    }
};