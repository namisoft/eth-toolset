/**
 * Author: Vu Duy Tuan - tuanvd@gmail.com
 * Date: 5/27/19
 * Time: 10:56 AM
 */

const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');
const utils = require('./utils');
const config = require('./config');

const argv = require('minimist')(process.argv.slice(2));

// Get source files to compile
const sourcePath = path.join(__dirname, config.contractSourcePath);
/*
let sourceFiles = [];
if (argv['f'] === undefined || argv['f'] === null) {
    // File name not specified, we will compile all source files found in source path
    sourceFiles = utils.getFileList(sourcePath, '.sol');
} else {
    sourceFiles = [argv['f']];
}
*/
const sourceFiles = utils.getFileList(sourcePath, '.sol');


let sources = {};
sourceFiles.forEach((sourceFile) => {
    sources[sourceFile] = {content: fs.readFileSync(path.resolve(sourcePath, sourceFile), 'utf8')}
});

const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

// Do compile
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output === undefined) {
    console.log('Unknown error in compiling');
    process.exit();
} else if (output.contracts === undefined) {
    console.log(`Compile error: ${JSON.stringify(output)}`);
    process.exit();
}


// Write output to file
const compileTime = Date.now();
sourceFiles.forEach((sourceFile) => {
    if (output.contracts[sourceFile] !== undefined) {
        for (let contractName in output.contracts[sourceFile]) {
            if (output.contracts[sourceFile].hasOwnProperty(contractName)) {
                const builtFilePath = path.resolve(config.builtContractPath, `${contractName}.json`);
                // Remove old contract built file (if any)
                fs.removeSync(builtFilePath);
                // Write contract built file
                const builtData = output.contracts[sourceFile][contractName];
                fs.outputJsonSync(
                    builtFilePath,
                    {
                        contractName: contractName,
                        abi: builtData.abi,
                        bytecode: '0x' + builtData.evm.bytecode.object,
                        sourceMap: builtData.evm.bytecode.sourceMap,
                        deployedBytecode: '0x' + builtData.evm.deployedBytecode.object,
                        deployedSourceMap: builtData.evm.deployedBytecode.sourceMap,
                        compiler: {
                            name: 'solc',
                            version: solc.version()
                        },
                        compileTime: compileTime
                    }
                );
                console.log(`Contract ${contractName} from source file ${sourceFile} built --> ${builtFilePath}`);
            }
        }
    }
});