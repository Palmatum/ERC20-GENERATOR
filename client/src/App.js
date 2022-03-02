import { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import GeneratorContract from "./contracts/Generator.json";
import Token from "./contracts/Token.json";

function App() {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });

  const [input, setInput] = useState({
    supply: null,
    name: null,
    symbol: null,
  });

  const [output, setOutput] = useState({
    outputSupply: null,
    outputName: null,
    outputSymbol: null,
    outputAddress: null,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    (async () => {
      const web3 = new Web3(window.ethereum);
      if (web3.eth.getAccounts() !== [] && state.accounts === null) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = GeneratorContract.networks[networkId];
        const instance = new web3.eth.Contract(
          GeneratorContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setState({ ...state, web3, accounts, contract: instance });
        setConnected(true);
      }
    })();
  });

  const connectMetamask = async () => {
    if (typeof window.ethereum != undefined) {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GeneratorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GeneratorContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setState({ ...state, web3, accounts, contract: instance });
      setConnected(true);
    } else {
      console.log("Already connected");
    }
  };

  useEffect(() => {
    console.log(output);
  }, [output]);

  const generateERC = async () => {
    const { accounts, contract } = state;
    const { supply, name, symbol } = input;
    let tokenAddress = await contract.methods
      .createToken(supply, name, symbol)
      .send({ from: accounts[0] });

    const tokenInstance = new state.web3.eth.Contract(
      Token.abi,
      tokenAddress.events[0].address
    );
    // tokenInstance.options.address = String(tokenAddress);
    console.log(tokenAddress.events[0].address);
    const outputName = await tokenInstance.methods.name().call();
    const outputSymbol = await tokenInstance.methods.name().call();
    const outputAddress = await tokenInstance.methods.getAddress().call();
    const outputSupply = await tokenInstance.methods.totalSupply().call();
    setOutput({ outputName, outputSymbol, outputAddress, outputSupply });
  };

  const changeSupply = (e) => {
    let supply = parseInt(e.target.value);
    setInput({ ...input, supply });
  };

  const changeName = (e) => {
    let name = e.target.value;
    setInput({ ...input, name });
  };

  const changeSymbol = (e) => {
    let symbol = e.target.value;
    setInput({ ...input, symbol });
  };

  return (
    <div className="conatiner mx-auto flex flex-col gap-4 w-96 p-5">
      {connected ? (
        ""
      ) : (
        <button
          className="bg-orange-600 text-white border-2 rounded-md ring-4 ring-orange-700 border-orange-800 hover:outline-none hover:bg-orange-400 p-4"
          onClick={connectMetamask}
        >
          Connect metamask
        </button>
      )}
      <input
        className="bg-zinc-100 border-2 rounded-md border-indigo-600 focus:outline-none focus:border-indigo-800 active:border-amber-800 p-4"
        onChange={changeSupply}
        type="text"
        placeholder="Enter the supply"
      />
      <input
        className="bg-zinc-100 border-2 rounded-md border-indigo-600 focus:outline-none focus:border-indigo-800 active:border-amber-800 p-4"
        onChange={changeName}
        type="text"
        placeholder="Enter the name"
      />
      <input
        className="bg-zinc-100 border-2 rounded-md border-indigo-600 focus:outline-none focus:border-indigo-800 active:border-amber-800 p-4"
        onChange={changeSymbol}
        type="text"
        placeholder="Enter the symbol"
      />
      <button
        className="bg-indigo-600 text-white border-2 rounded-md ring-4 ring-indigo-700 border-indigo-800 hover:outline-none hover:bg-indigo-400 p-4"
        onClick={generateERC}
      >
        Set Greet
      </button>

      {/* {(output.name !== null && output.address !== null) ? (
        <h1>
          The address of {output.outputName} ({output.outputSymbol}) is: {output.outputAddress}
        </h1>
      ) : (
        ""
      )} */}
    </div>
  );
}

export default App;
