import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors';
import React, { useState, useEffect } from "react";
//
import { Button } from '@mui/material';


export default function ConnectMetamask() {
    const { active, account, chainId, activate, deactivate } = useWeb3React();
    const [hasMetamask, setHasMetamask] = useState(false);

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });

    if (!hasMetamask) {
        return (
            <div>
                <a href="https://metamask.io/" target="_blank" rel="noreferrer">Please install Metamask</a>
            </div >
        )
    }
    if (!active) {
        return (
            <div >
                <Button href="#" color='primary' variant="outlined" sx={{ my: 1, mx: 1.5 }}
                    onClick={() => { activate(injected) }}>Connect Metamask</Button>
            </div >
        )

    } else if (chainId == 4) {
        return (
            <div >User Address: {account}
                < Button href="#" variant="text" sx={{ my: 1, mx: 1.5 }} color="error"
                    onClick={deactivate} > disconnect</Button >
            </div >
        )

    } else {
        return (
            <div >
                {alert("please change to the rinkeby testnet")}
            </div >
        )
    }

}

