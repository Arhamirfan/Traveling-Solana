// import './App.css';
import * as solanaWeb3 from '@solana/web3.js';
import { SystemProgram, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useState, FC, useCallback, useEffect } from 'react';
import { Buffer } from 'buffer';


function App() {



  var [isconnected, setIsConnected] = useState(false);
  var [inputText, setInputText] = useState();
  var [walletText, setWalletText] = useState();

  var wallet;
  const lamports_per_sol = solanaWeb3.LAMPORTS_PER_SOL;


  function connectWallet() {

    (async () => {
      try {
        const resp = await window.solana.connect();
        console.log('resp: '+ resp);
        wallet = resp.publicKey;
        console.log('whole wallet: '+ wallet);
        //console.log('wallet: ', wallet);
        setWalletText(wallet);
        // console.log('wallet: ' + wallet.publicKey);
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    })();
    window.solana.on("connect", () => {
      try {
        setIsConnected(true);
      } catch (error) {
        console.log('error: '+ error);
      }
      //var issconnected = true;
      
      
    })

  }

  useEffect(() => {
    isconnected===true?document.getElementById("status").innerText = "Connected": document.getElementById("status").innerText = "Not Connected";
    //setIsConnected(isconnected);

    isconnected===true?document.getElementById("_publickeyy").innerText = walletText: document.getElementById("_publickeyy").innerText = "Connect wallet to show public key";
  });

  function signInTransactionAndSendMoney() {

    (async () => {

      const network = "https://api.devnet.solana.com";
      const connection = new solanaWeb3.Connection(network);
      const transaction = new solanaWeb3.Transaction();
      var walletAccountInfo, destPubkey;
      var lamports = document.getElementById("quantity").value * lamports_per_sol;
      if (parseFloat(walletText) > 0.001) {

        lamports = parseFloat(walletText) * lamports_per_sol;
        try {
          var destPubkeyStr = "5D5WnA4akR12X2P9N2Fj5eQfNCLaGoBj7jJwRcqdhC5x";
          lamports = document.getElementById("quantity").value * lamports_per_sol;
          console.log('wallet address in sending transection : '+walletText);
          //console.log("starting sendMoney");
          
            //destPubkey = new solanaWeb3.PublicKey(destPubkeyStr);

            //console.log('dest public key: ' + wallet.publicKey);
            //walletAccountInfo = await connection.getAccountInfo(wallet.publicKey);
          
          //console.log("wallet data size", walletAccountInfo?.data.length);

          //const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
          //console.log("receiver data size", receiverAccountInfo?.data.length);
          window.Buffer = Buffer;
          const instruction = solanaWeb3.SystemProgram.transfer({
            fromPubkey: walletText,
            toPubkey: destPubkeyStr,
            lamports, // about half a SOL
          });
          let trans = await setWalletTransaction(instruction, connection);

          let signature = await signAndSendTransaction(walletText, trans, connection);
          let result = await connection.confirmTransaction(signature, "singleGossip");
          console.log("money sent", result);
        } catch (e) {
          console.warn("Failed", e);
        }
      } else {
        console.log('value cannot be less than 0.001');
        console.log(walletText);
      }



    })()

    async function setWalletTransaction(instruction, connection) {
      try {
        const transaction = new solanaWeb3.Transaction();
      transaction.add(instruction);
      transaction.feePayer = walletText;
      let hash = await connection.getRecentBlockhash();
      console.log("blockhash", hash);
      transaction.recentBlockhash = hash.blockhash;
      return transaction;
      } catch (error) {
        console.log('setwallettransection function error:'+ error);
      }
    }

    async function signAndSendTransaction(wallet,transaction,connection) {
      // Sign transaction, broadcast, and confirm
      try {
        const { signature } = await window.solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature);


      //let signedTrans = await wallet.signTransaction(transaction);
      console.log("sign transaction");
      //let signature = await connection.sendRawTransaction(signedTrans.serialize());
      console.log("send raw transaction");
      return signature;
      } catch (error) {
        console.log('sign and send function error:'+ error);
      }
    }

  }


  return (
    <div className="App">
      <button onClick={connectWallet}>Connect</button>
      <input type="number" onChange={(e) => { setInputText(e.target.value); }} placeholder="Sol to send" id="quantity" />
      <button onClick={signInTransactionAndSendMoney}>Send Money</button>
      <p id="status_p">
        Status: <span id="status">Disconnected</span>
      </p>

      <p id='wallet'> Wallet : <span id="_publickeyy">Disconnected</span></p>

    </div>
  );
}

export default App;
