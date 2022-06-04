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
import { theme, sx_card, sx_header, sx_headerBorrow } from '../stile';
import TitleDescription from '../components/titleDescription';
import ConnectMetamask from '../components/connectMetamask';
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers';
import * as data from "../brownie-config.json"
import * as erc20 from "../brownie_build/interfaces/IERC20.json"
import { useState, useEffect } from 'react';
import {
  getAssetReserveData, getProcessedUserData, getApy, depositToAave, repayStable,
  withdrawFromAave, depositETHtoAave, withdrawETHfromAave, borrowFromAaveStable
} from '../lendingPoolAaveV3';
import { parseUnits } from 'ethers/lib/utils';
import { userBalances } from '../balances';


// market is in usd, set reserves values (borroe power, debt values...) to usd
const TO_MARKET = 10 ** 18


export default function Home() {

  const { active, chainId, account, library: provider } = useWeb3React();

  //APYs
  const [apyDai, setApyDai] = useState(0);
  const [apyWeth, setApyWeth] = useState(0);

  // inputs
  const [inputDaiDeposit, setInputDaiDeposit] = useState("");
  const [inputDaiWithdraw, setInputDaiWithdraw] = useState("");
  const [inputDAIborrow, setInputDAIborrow] = useState("");
  const [inputDAIrepay, setInputDAIrepay] = useState("");
  const [inputEthDeposit, setInputEthDeposit] = useState("");
  const [inputEthWithdraw, setInputEthWithdraw] = useState("");
  function clearInputs() {
    setInputDaiDeposit("")
    setInputDaiWithdraw("")
    setInputDAIborrow("")
    setInputDAIrepay("")
    setInputEthDeposit("")
    setInputEthWithdraw("")
  }

  //balances
  const [daiBalance, setDaiBalance] = useState(0);
  const [aDaiBalance, setADaiBalance] = useState(0);
  const [wethBalance, setWethBalance] = useState(0);
  const [aWethBalance, setAWethBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [stDebtDai, setStDebtDai] = useState(0);
  //* user data: 
  // totalCollateralBase,
  // totalDebtBase,
  // availableBorrowsBase,
  // currentLiquidationThreshold,
  // ltv,
  // healthFactor      
  const [userData, setUserData] = useState([0, 0, 0, 0, 0, 0]);

  // reserve data:
  // currentLiquidityRate,
  // currentStableBorrowRate,
  // aTokenAddress,
  // stableDebtTokenAddress,
  const [reserveDAIdata, setReserveDAIdata] = useState([0, 0, data.networks.rinkeby.dai, data.networks.rinkeby.dai]);

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

      userBalances(reserveDAIdata[3], provider, account).then((value) => {
        setStDebtDai(value)
      })

      userBalances("ether", provider, account).then((value) => {
        setEthBalance(value)
      })
    }
  }

  // get more account, reserve data
  useEffect(() => {
    console.log("in use effect")
    // get user account data, rates, debt power ...
    async function getUserAccountData() {
      if (active && chainId == 4) {
        const userdata = await getProcessedUserData(provider, account)
        const _rates = await getAssetReserveData(data.networks.rinkeby.dai, provider)
        setUserData(userdata);
        setReserveDAIdata(_rates)
      }
    }
    getUserAccountData();
  }, [inputDAIborrow, setUserData, setReserveDAIdata]);

  updateUserData();

  /**
   *  handle user  actions ... it can be done better.^ 
   */
  const handleInputDaiDeposit = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDaiDeposit(input);
    } else {
      alert("enter a valid imput")
      clearInputs()
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
      clearInputs()
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
      clearInputs()
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
      clearInputs()
    }
    event.preventDefault();
  }

  const handleInputDAIborrow = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDAIborrow(input);
    } else {
      alert("enter a valid imput")
      clearInputs()
    }
    event.preventDefault();
  }
  const handleInputDAIrepay = (event) => {
    const input = event.target.value;
    console.log("entering", input)
    if (!isNaN(input)) {
      setInputDAIrepay(input);
    } else {
      alert("enter a valid imput")
      clearInputs()
    }
    event.preventDefault();
  }

  const handleDepositErc20 = (assetAddr, balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      depositToAave(assetAddr, ethers.utils.parseEther(amount), 0, provider, account).then(() => {
        clearInputs();
        updateUserData();
      })
    } else {
      alert("insuficient balance")
    }
  }

  const handleBorrowErc20 = (assetAddr, balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      borrowFromAaveStable(assetAddr, ethers.utils.parseEther(amount), provider, account).then(() => {
        clearInputs();
        updateUserData();
      })
    } else {
      alert("enter a valid amount")
    }
  }

  const handleRepayErc20 = (assetAddr, balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      repayStable(assetAddr, ethers.utils.parseEther(amount), provider, account).then(() => {
        clearInputs();
        updateUserData();
      })
    } else {
      alert("enter a valid amount")
    }
  }



  const handleDepositETH = (balance, amount) => {
    console.log("Balance", balance)
    console.log("input", amount)
    if (balance >= Number(amount)) {
      depositETHtoAave(account, 0, provider, ethers.utils.parseEther(amount)).then(() => {
        clearInputs();
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
        clearInputs();
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
        clearInputs();
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
      <AppBar position="static" elevation={0}
        sx={sx_header}>
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography color={"black"} variant="h6" noWrap sx={{ flexGrow: 1 }}>
            THESIS_DAPP
          </Typography>
          <ConnectMetamask />
        </Toolbar>
      </AppBar>
      {/* Title */}
      <TitleDescription />
      {/* */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={3} alignItems="flex-end">
          {/* */}
          <Grid item xs={3} sm={4} md={4}>
            <Card>
              <CardHeader title={"ETH"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="body1">
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
          <Grid item xs={3} sm={4} md={4}>
            <Card>
              <CardHeader title={"DAI"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_header} />
              <CardContent>
                <Box sx={sx_card}>
                  <Typography component="h1" variant="body1">
                    <ul> APY: {reserveDAIdata[0].toFixed(7)} %</ul>
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
          <Grid item xs={3} sm={4} md={4}>
            <Card color="red">
              <CardHeader title={"Borrow DAI"} titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }} sx={sx_headerBorrow} />
              <CardContent>
                <Box sx={sx_card} >
                  <Typography color="text.secondary" component="h1" variant="body1">
                    <ul> Stable Borrow Rate: {reserveDAIdata[1].toFixed(4)} %</ul>
                    <ul> Max Borroable: {((userData[2] / 10 ** 8)) * 0.95}</ul>
                    <ul> DAI Debt: {(stDebtDai)}</ul>
                    {/* display debt in usd */}
                    {/* <ul> Total Debt: {(userData[1]) / (10 ** 8)}</ul> */}
                    {/* display Hf */}
                    <ul> Health Factor: {(userData[5]) / (TO_MARKET) / 100}</ul>
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputDAIborrow}
                    onChange={handleInputDAIborrow}
                  />
                  <Button onClick={() => { handleBorrowErc20(data.networks.rinkeby.dai, ((userData[2] / 10 ** 8)) * 0.95, inputDAIborrow) }} fullWidth variant={"outlined"}>
                    borrow{' '}
                  </Button>
                </ul>
                <ul>
                  <TextField variant="outlined" label="enter amount" size="small"
                    value={inputDAIrepay}
                    onChange={handleInputDAIrepay}
                  />
                  <Button onClick={() => { handleRepayErc20(data.networks.rinkeby.dai, daiBalance, inputDAIrepay) }} fullWidth variant={"outlined"}>
                    pay{' '}
                  </Button>
                </ul>
              </CardActions>
            </Card>
          </Grid>


        </Grid>
      </Container>

      {/* Footer */}
      <br></br>
      <br></br>
      <br></br>
      <Typography variant="overline" align="center" color="text.secondary" component="p">
        <a href="https://github.com/cito-lito/test_dapp" target="_blank" rel="noreferrer">github repo</a>
      </Typography>
    </React.Fragment>
  )
}

