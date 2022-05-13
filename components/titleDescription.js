import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function TitleDescription() {
    return (
        <div>
            <Container disableGutters maxWidth="lg" component="main" sx={{ pt: 6, pb: 6 }}>
                <Typography component="h2" variant="h3" align="center"
                    color="text.primary" gutterBottom >
                    Deposit assets to earn interest using Aave - rinkeby testnet
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    Get test tokens:
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" component="p">
                    <a href="https://faucets.chain.link/rinkeby" target="_blank" rel="noreferrer">Eth rinkeby</a>
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" component="p">
                    <a href="https://staging.aave.com/faucet/" target="_blank" rel="noreferrer">Aave rinkeby test assets</a>
                </Typography>
            </Container>
        </div>)
}