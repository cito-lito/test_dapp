import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { sx_card, sx_header } from '../stile';
import TitleDescription from '../components/titleDescription';
import ConnectMetamask from '../components/connectMetamask';
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers';
import * as data from "../brownie-config.json"
import * as erc20 from "../brownie_build/interfaces/IERC20.json"
import { useState } from 'react';
import { getApy, depositToAave, withdrawFromAave, depositETHtoAave, withdrawETHfromAave } from '../lendingPoolAaveV3';
import { parseUnits } from 'ethers/lib/utils';
import { userBalances } from '../balances';


export default function Home() {

  const { active, chainId, account, library: provider } = useWeb3React();

  //APYs
  const [apyDai, setApyDai] = useState(0);
  const [apyWeth, setApyWeth] = useState(0);

  // inputs
  const [inputDaiDeposit, setInputDaiDeposit] = useState("");
  const [inputDaiWithdraw, setInputDaiWithdraw] = useState("");
  const [inputWethDeposit, setInputWethDeposit] = useState("");
  const [inputWethWithdraw, setInputWethWithdraw] = useState("");
  const [inputEthDeposit, setInputEthDeposit] = useState("");
  const [inputEthWithdraw, setInputEthWithdraw] = useState("");

  //balances
  const [daiBalance, setDaiBalance] = useState(0);
  const [aDaiBalance, setADaiBalance] = useState(0);
  const [wethBalance, setWethBalance] = useState(0);
  const [aWethBalance, setAWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);



  const updateUserData = () => {
    if (active && chainId === 4) {
      getApy(data.networks.rinkeby.dai, provider).then((value) => {
        setApyDai(value)
      })
      getApy(data.networks.rinkeby.weth, provider).then((value) => {
        setApyWeth(value)
      })
      userBalances(data.networks.rinkeby.dai, provider, account).then((value) => {
        setDaiBalance(value)
      })
      userBalances(data.networks.rinkeby.aDAI, provider, account).then((value) => {
        setADaiBalance(value)
      })
      userBalances(data.networks.rinkeby.weth, provider, account).then((value) => {
        setWethBalance(value)
      })
      userBalances(data.networks.rinkeby.aWETH, provider, account).then((value) => {
        setAWethBalance(value)
      })
      userBalances("ether", provider, account).then((value) => {
        setEthBalance(value)
      })

    }
  }
  updateUserData();

  const handleInputDaiDeposit = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDaiDeposit(input);
    } else {
      alert("enter a valid imput")
      setInputDaiDeposit("")
    }
    event.preventDefault();
  }
  const handleInputDaiWithdraw = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDaiWithdraw(input);
    } else {
      alert("enter a valid imput")
      setInputDaiWithdraw("")
    }
    event.preventDefault();
  }

  const handleInputETHDeposit = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputEthDeposit(input);
    } else {
      alert("enter a valid imput")
      setInputEthDeposit("")
    }
    event.preventDefault();
  }
  const handleInputETHWithdraw = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputEthWithdraw(input);
    } else {
      alert("enter a valid imput")
      setInputEthWithdraw("")
    }
    event.preventDefault();
  }

  const handleInputWethDeposit = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputWethDeposit(input);
    } else {
      alert("enter a valid imput")
      setInputWethDeposit("")
    }
    event.preventDefault();
  }
  const handleInputWethWithdraw = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputWethWithdraw(input);
    } else {
      alert("enter a valid imput")
      setInputWethWithdraw("")
    }
    event.preventDefault();
  }

  const handleDepositErc20 = (assetAddr, balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      depositToAave(assetAddr, ethers.utils.parseEther(amount), 0, provider, account).then(() => {
        setInputDaiDeposit("")
        setInputWethDeposit("")
        updateUserData();
      })
    } else {
      alert("insuficient balance")
    }
  }

  const handleDepositETH = (balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      depositETHtoAave(account, 0, provider, ethers.utils.parseEther(amount)).then(() => {
        setInputDaiDeposit("")
        setInputWethDeposit("")
        setInputEthDeposit("")
        updateUserData();
      })
    } else {
      alert("insuficient balance")
    }
  }
  const handleWithdrawETH = (balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      withdrawETHfromAave(account, provider, ethers.utils.parseEther(amount)).then(() => {
        setInputDaiDeposit("")
        setInputWethDeposit("")
        setInputEthWithdraw("")
        updateUserData();
      })
    } else {
      alert("insuficient balance")
    }
  }

  const handleWithdrawErc20 = (assetAddr, balance, amount) => {
    console.log("Balance", balance)
    console.log("input withdraw", amount)
    if (balance >= Number(amount)) {
      withdrawFromAave(assetAddr, ethers.utils.parseEther(amount), account, provider).then(() => {
        setInputDaiWithdraw("")
        setInputWethWithdraw("")
        updateUserData();
      })
    } else {
      alert("insuficient balance")
    }
  }

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            TEST_DAPP
          </Typography>
          <ConnectMetamask />
        </Toolbar>
      </AppBar>
      {/* Title */}
      <TitleDescription />
      {/* */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
          {/* */}
          <Grid item xs={4} sm={6} md={6}>
            <Card>
              <CardHeader title={"ETH"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="h6">
                    <ul> APY: {apyWeth.toFixed(7)} %</ul>
                    <ul> Balance: {ethBalance}</ul>
                    <ul> Deposited: {aWethBalance}</ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputEthDeposit}
                    onChange={handleInputETHDeposit}
                  />
                  <Button onClick={() => { handleDepositETH(ethBalance, inputEthDeposit) }}
                    fullWidth variant="outlined">
                    Deposit{' '}
                  </Button>

                </ul>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputEthWithdraw}
                    onChange={handleInputETHWithdraw}
                  />

                  <Button onClick={() => { handleWithdrawETH(aWethBalance, inputEthWithdraw) }}
                    fullWidth variant={"outlined"}>
                    withdraw{' '}
                  </Button>
                </ul>
              </CardActions>
            </Card>
          </Grid>
          {/* */}
          {/* */}
          <Grid item xs={4} sm={6} md={6}>
            <Card>
              <CardHeader title={"DAI"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="h6">
                    <ul> APY: {apyDai.toFixed(7)} %</ul>
                    <ul> Balance: {daiBalance}</ul>
                    <ul> Deposited: {aDaiBalance}</ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputDaiDeposit}
                    onChange={handleInputDaiDeposit}
                  />
                  <Button onClick={() => { handleDepositErc20(data.networks.rinkeby.dai, daiBalance, inputDaiDeposit) }}
                    fullWidth variant="outlined">
                    Deposit{' '}
                  </Button>

                </ul>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputDaiWithdraw}
                    onChange={handleInputDaiWithdraw}
                  />

                  <Button onClick={() => { handleWithdrawErc20(data.networks.rinkeby.dai, aDaiBalance, inputDaiWithdraw) }}
                    fullWidth variant={"outlined"}>
                    withdraw{' '}
                  </Button>
                </ul>
              </CardActions>
            </Card>
          </Grid>
          {/* */}
          {/* */}
          {/* <Grid item xs={4} sm={6} md={6}>
            <Card>
              <CardHeader title={"WETH"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="h6">
                    <ul> APY: {apyWeth.toFixed(7)} %</ul>
                    <ul> Balance: {wethBalance}</ul>
                    <ul> Deposited: {aWethBalance}</ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputWethDeposit}
                    onChange={handleInputWethDeposit}
                  />
                  <Button onClick={() => { handleWithdrawErc20(data.networks.rinkeby.weth, wethBalance, inputWethDeposit) }} fullWidth variant={"outlined"}>
                    Deposit{' '}
                  </Button>
                </ul>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputWethWithdraw}
                    onChange={handleInputWethWithdraw}
                  />
                  <Button onClick={() => { handleWithdrawErc20(data.networks.rinkeby.weth, aWethBalance, inputWethWithdraw) }} fullWidth variant={"outlined"}>
                    withdraw{' '}
                  </Button>
                </ul>
              </CardActions>
            </Card>
          </Grid>
           */}

        </Grid>
      </Container>

      {/* Footer */}
      <Typography variant="h6" align="center" color="text.secondary" component="p">
        <a href="https://github.com/cito-lito/test_dapp" target="_blank" rel="noreferrer">github repo</a>

      </Typography>

      

    </React.Fragment>
  )
}

