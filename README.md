poetry
tsc

<h1 style="font-size:32px;color:#222;">instruction:</h1> <br>
remove this lines from tsconfig.json: <br>
{      <br>
    "allowImportingTsExtensions": true, <br>
    "noEmit": true, <br>
} <br>

then enter 'tsc' <br>
add .js in import path of main.js <br>
then reinsert the lines: <br>
{     <br>
    "allowImportingTsExtensions": true, <br>
    "noEmit": true, <br>
} <br>
