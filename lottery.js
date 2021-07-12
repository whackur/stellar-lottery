const StellarSdk = require("stellar-sdk");
require('dotenv').config();
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const {pool} = require('./array');
const checkEnv = require('check-env');

checkEnv([
  'XLM_SECRET',
  'NETWORK',
])

const server = new StellarSdk.Server(process.env.NETWORK, {allowHttp: true});

async function lottery (argv) {
  console.log('argv => ', argv);
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
  console.log(resp._links.self.href);
}

lottery(argv);