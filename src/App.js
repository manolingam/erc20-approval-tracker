import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Loading, TextInput, Dropdown } from "carbon-components-react";
import Web3 from "web3";
import ethers from "ethers";

import Approvals from "./components/Approvals";

import "./App.scss";

const ERC20_abi = require("./abi/ERC20_ABI.json");

const fetchTokenLists = async () => {
    const res = await fetch("https://gateway.ipfs.io/ipns/tokens.uniswap.org");
    return res.json();
};

function App() {
    const { status, data } = useQuery("tokenlists", fetchTokenLists);
    const [account, setAccount] = useState("");
    const [tokenList, setTokenList] = useState({});
    const [tokens, setTokens] = useState([]);

    const [tokenChosen, setTokenChosen] = useState("");
    const [approvals, setApprovals] = useState([]);

    const actionHandler = async () => {
        if (!Web3.utils.isAddress(account))
            return alert("Not a valid address!");
        if (tokenChosen === "") return alert("Select Token!");
        let contract = new ethers.Contract(
            tokenList[tokenChosen].address,
            ERC20_abi,
            new ethers.providers.InfuraProvider(
                "homestead",
                process.env.REACT_APP_INFURA_ID
            )
        );

        let approvalTopics = contract.filters.Approval(account);

        contract.queryFilter(approvalTopics).then((results) => {
            setApprovals(results);
        });
    };

    useEffect(() => {
        if (status === "success") {
            let tokenList = { "All Tokens": { address: undefined } };
            let tokens = ["All Tokens"];
            data.tokens.forEach((token) => {
                if (!tokenList[token.name]) {
                    tokenList[token.name] = {
                        symbol: token.symbol,
                        address: token.address,
                    };
                    tokens.push(token.name);
                }
            });
            setTokenList(tokenList);
            setTokens(tokens);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <div className='app'>
            {status === "loading" ? (
                <Loading
                    description='Active loading indicator'
                    withOverlay={false}
                />
            ) : (
                <>
                    <div className='search-approvals'>
                        <div className=''>
                            <p id='title'>
                                Who is approved? <span> v0.0.1</span>
                            </p>
                        </div>

                        <div className='input-container'>
                            <TextInput
                                id='input-address-field'
                                invalidText='A valid value is required'
                                placeholder='Ethereum address..'
                                onChange={(e) => setAccount(e.target.value)}
                            />
                            <Dropdown
                                ariaLabel='Dropdown'
                                id='carbon-dropdown-tokens'
                                items={tokens}
                                label='Select Token'
                                titleText=''
                                onChange={(e) => setTokenChosen(e.selectedItem)}
                            />
                        </div>
                        <i
                            className='fas fa-search'
                            onClick={actionHandler}
                        ></i>
                    </div>
                    <div className='list-approvals'>
                        {approvals.length ? (
                            <Approvals approvals={approvals} />
                        ) : (
                            <p id='empty-render-text'>Nothing to render..</p>
                        )}
                    </div>
                </>
            )}
            <p id='built-by'>
                Built by{" "}
                <a
                    href='https://twitter.com/saimano1996'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Saimano
                </a>
            </p>
        </div>
    );
}

export default App;
