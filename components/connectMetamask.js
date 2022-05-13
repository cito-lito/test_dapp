import { useWeb3React } from '@web3-react/core'
import { injected } from '../connectors';
//
import { Button } from '@mui/material';

export default function ConnectMetamask() {
    const { active, account, chainId, activate, deactivate } = useWeb3React();

    if (!active) {
        return (
            <div >
                <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}
                    onClick={() => { activate(injected) }}>Connect Metamask</Button>
            </div>)

    } else {
        return (

            <div >
                {chainId == 4 ? (
                    <div>
                        {account}
                        < Button href="#" variant="text" sx={{ my: 1, mx: 1.5 }} color="error"
                            onClick={deactivate}>disconnect</Button>
                    </div >) :
                    (alert("please change to the rinkeby testnet"))
                }
            </div >)
    }

}

