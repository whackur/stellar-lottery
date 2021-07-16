const StellarSdk = require("stellar-sdk");
require('dotenv').config();
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
// const {pool} = require('./array');
const checkEnv = require('check-env');

checkEnv([
  'XLM_SECRET',
  'NETWORK',
])

const server = new StellarSdk.Server(process.env.NETWORK, {allowHttp: true});

async function lottery (argv) {
  // console.log('argv => ', argv);
  const keypair = StellarSdk.Keypair.fromSecret(process.env.XLM_SECRET);
  const fromAddress = keypair.publicKey();
  const loadedAccount = await server.loadAccount(fromAddress);
  const txOptions = {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  };
  const transaction = new StellarSdk.TransactionBuilder(
    loadedAccount,
    txOptions,
  )
    .addOperation(
      StellarSdk.Operation.payment({
        destination: argv.t,
        asset:StellarSdk.Asset.native(),
        amount: argv.amount.toString(),
      }),
    )
    .addMemo(argv.memo ? StellarSdk.Memo.text(argv.memo) : StellarSdk.Memo.none())
    .setTimeout(180)
    .build();
  transaction.sign(keypair);
  const resp = await server.submitTransaction(transaction);
  const hash = resp.hash; // ex) 7db401fdbe64a1c8ef1904cd7fdc97395ab2274c23141c1e9b653ee28f5b380
    let randNum = 0;
  for (const letter of hash) {
      randNum += Math.pow(letter.charCodeAt(0), 2) - 1
      // randNum += letter.charCodeAt(0)
  }
  randNum = parseInt(randNum.toString().split('').reverse().join(''), 10);
  randNum = Math.floor(randNum / 10)
  console.log(`Random Number: ${randNum}`);
  const rem = randNum % argv.p;
  console.log(`WIN: ${rem}`);
  console.log(resp._links.self.href);
}

lottery(argv);