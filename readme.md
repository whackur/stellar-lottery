# Stellar Lottery

# Install
Copy Settings
```shell
cp .env.sample .env
cp array.sample.js array.js
```

Set XLM_SECRET, NETWORK

# Usage
-t: transaction to address

-m: memo

--amount: amount

-p: pool number

```shell
node lottery.js -t GBVZZO7AHBK3E2TUCYEZ4UJJZVXODMRFLFYZNBDW4ZMTZFV4FUJUVFHE -m MEMO --amount 0.000001 -p 20
```