# eth-toolset (Ethereum Development Toolset)
With Ethereum Development Toolset, you can easily:
* Compile your smart contract code into binary code that is ready for deployment
* Deploy your compile smart contract to Ethereum networks
* Invoke smart contract methods from console (commandline) for testing purpose

## Configuration
Change config values in the file `config.js` to make it works:
* `contractSourcePath`: the path of folder that contains your *.sol* source files
* `builtContractPath`: the build target folder path
* `deployedContractPath`: the path of folder to save deployed contracts information
* `networks`: define networks to deploy and interact with deployed smart contracts.   
                  Each network is in an entry of `networks` dictionary: `network_id: {...}`   
                  _For example_:  
                   ```
                          dev: {
                              url: "http://localhost:8545",
                              defaultAccount: {
                                  address: '0x...',
                                  privateKey: 'Your account private key'
                              },
                              gas: 6500000
                          }
                  ```

## Compile smart contract(s)
Run the following command in your terminal:  
  >  ```node compile.js```  
  
That will compile all `.sol` files in the `contractSourcePath`.
Each contract's bytecode and definition will be saved as `<builtContractPath>/<contract_name>.json` file.  
We will support compile single `.sol` file in the future.

## Deploy smart contract
Run the following command in your terminal:  
  >  ```node deploy.js --contract=YourContractName [--network=targetNetworkId] [--params='[param1, param2,...]]'``` 

In that:
* --contract (required): your contract name
* --network (optional): the Id of network (defined in the config key `networks`) that you want to deploy the contract to.
                        If skipped, the net work id `default` will be used.
* --params (optional): the parameters's values that will be passed to the smart contract's constructor.
                       Skip this if the smart contract's constructor has no parameter. 

This finds the contract `<builtContractPath>/YourContractName.json` definition (generated by compile process) to deploy contract to the selected network.
The deployment information (_contract address, transaction hash,..._ ) will be saved to `<deployedContractPath>/YourContractName_<networkId>.json`.
For example:  
```
node deploy.js --contract=TradeLog --network=dev --params='[12345, "Mr Fun"]'
```
(if success, deployment info will be saved as `<deployedContractPath>/TradeLog_dev.json`)
