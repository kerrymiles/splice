poetry
tsc

instruction: 
remove this lines from tsconfig.json:
{     
    "allowImportingTsExtensions": true,
    "noEmit": true,
}
then enter 'tsc'
add .js in import path of main.js
then reinsert the lines:
{     
    "allowImportingTsExtensions": true,
    "noEmit": true,
}
