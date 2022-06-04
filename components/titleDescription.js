import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function TitleDescription() {
    return (
        <div>
            <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 6, pb: 6 }}>
                <Typography component="h6" variant="h5" align="center"
                    color="text.secondary" gutterBottom >
                     <ul>****Deposit ETH or DAI to earn interst****</ul> 
                     <ul>****Borrow DAI at stable interest rate**** </ul>
                     <ul>--using Aave (rinkeby testnet)--</ul>
                    <br></br>
                </Typography>
                <Typography variant="button" align="center" color="text.secondary" component="p">
                    Get test tokens:   
                </Typography>
                <Typography variant="overline" align="center" color="text.secondary" component="p">
                    <a href="https://rinkebyfaucet.com/" target="_blank" rel="noreferrer">Eth rinkeby</a>
                </Typography>
                <Typography variant="overline" align="center" color="text.secondary" component="p">
                    <a href="https://faucets.chain.link/rinkeby" target="_blank" rel="noreferrer">Eth rinkeby</a>
                </Typography>
                <Typography variant="overline" align="center" color="text.secondary" component="p">
                    <a href="https://staging.aave.com/faucet/" target="_blank" rel="noreferrer">Aave rinkeby test assets</a>
                </Typography>
            </Container>
        </div>)
}