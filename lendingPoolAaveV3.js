
import { ethers } from "ethers"
import * as data from "./brownie-config.json"
import IPoolAddressProvider from "./brownie_build/interfaces/IPoolAddressesProvider.json"
import IPool from "./brownie_build/interfaces/IPool.json"
import IERC20 from "./brownie_build/interfaces/IERC20.json"
import IWETHGateway from "./brownie_build/interfaces/IWETHGateway.json"

const SECONDS_PER_YEAR = 31536000
const RAY = 10 ** 27

/**
 * Get read only pool contract
 * @returns read only contract
 */
async function getPoolContract(provider) {
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        const pool_addr = await pool_addr_prov.getPool()

        const pool = new ethers.Contract(pool_addr, IPool.abi, provider);
        return pool;
    } catch (error) {
        console.error(error)
    }
}

/**
 * Get contract
 * @returns read, write contract
 */
async function getPoolContractWrite(provider) {
    const addr = data.networks.rinkeby.pool_addr_provider
    const abi = IPoolAddressProvider.abi
    try {
        const pool_addr_prov = new ethers.Contract(addr, abi, provider);
        const pool_addr = await pool_addr_prov.getPool()
        console.log("provider get Signer ", provider.getSigner())
        const pool = new ethers.Contract(pool_addr, IPool.abi, provider.getSigner());

        return pool;
    } catch (error) {
        console.error(error)
    }
}

/**
 * Get erc20 contract
 * @returns read, write contract
 */
async function getERC20ContractWrite(erc_addr, provider) {
    try {
        const contract = new ethers.Contract(erc_addr, IERC20.abi, provider.getSigner());
        return contract;
    } catch (error) {
        console.error(error)
    }
}

/**
 * Get user account data from pool contract
 */
async function getUserData(provider, account) {
    try {
        const pool = await getPoolContract(provider)
        // const data = [
        //     totalCollateralBase,
        //     totalDebtBase,
        //     availableBorrowsBase,
        //     currentLiquidationThreshold,
        //     ltv,
        //     healthFactor,
        // ]
        let tmp = new Array(6)
        tmp = await pool.getUserAccountData(account)
        return tmp
    } catch (error) {
        console.error(error)
    }
}


/**
 * get processed user account data 
 * //* user data: 
            // totalCollateralBase,
            // totalDebtBase,
            // availableBorrowsBase,
            // currentLiquidationThreshold,
            // ltv,
            // healthFactor    
 */
export async function getProcessedUserData(provider, account) {
    let tmp = new Array(6)
    const data = await getUserData(provider, account)
    for (var i = 0; i < data.length; i++) {
        tmp[i] = Number(data[i].toBigInt())
    }
    return tmp
}

/**
 * borrow a specific `amount` of the reserve underlying asset
 */
export async function borrowFromAaveStable(asset_addr, amount, provider, account) {
    try {
        const pool = await getPoolContractWrite(provider)
        // stable rate deposit
        const tx_borrow = await pool.borrow(asset_addr, amount, 1, 0, account)
        return tx_borrow.wait()
    } catch (error) {
        console.error(error)
    }
}

/**
 * Repays a borrowed `amount` on a specific reserve, burning the equivalent debt tokens owned
 */
export async function repayStable(asset_addr, amount, provider, account) {
    try {
        const pool = await getPoolContractWrite(provider)
        const erc20Contract = await getERC20ContractWrite(asset_addr, provider)
        const tx_approve = await erc20Contract.approve(pool.address, amount)
        await tx_approve.wait();
        // repay stable debt
        const tx_repay = await pool.repay(asset_addr, amount, 1, account)
        return tx_repay.wait()
    } catch (error) {
        console.error(error)
    }
}



/////// use getAssetReserveData() when refactoring...
/**
 * Returns the computed apy of the lending pool for a given asset
 */
export async function getApy(asset_addr, provider) {
    try {
        const pool = await getPoolContract(provider)
        const [
            configuration,
            liquidityIndex,
            currentLiquidityRate,
            variableBorrowIndex,
            currentVariableBorrowRate,
            currentStableBorrowRate,
            lastUpdateTimestamp,
            id,
            aTokenAddress,
            stableDebtTokenAddress,
            variableDebtTokenAddress,
            interestRateStrategyAddress,
            accruedToTreasury,
            unbacked,
            isolationModeTotalDebt,

        ] = await pool.getReserveData(asset_addr)

        const supplyRate = currentLiquidityRate.toBigInt()
        const supplyRateNumber = Number(supplyRate)
        const depositAPR = supplyRateNumber / RAY
        const depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1
        return (depositAPY * 100);
    } catch (error) {
        console.error(error);
    }
}

export async function getAssetReserveData(asset_addr, provider) {
    try {
        const pool = await getPoolContract(provider)
        const [
            configuration,
            liquidityIndex,
            currentLiquidityRate,
            variableBorrowIndex,
            currentVariableBorrowRate,
            currentStableBorrowRate,
            lastUpdateTimestamp,
            id,
            aTokenAddress,
            stableDebtTokenAddress,
            variableDebtTokenAddress,
            interestRateStrategyAddress,
            accruedToTreasury,
            unbacked,
            isolationModeTotalDebt,

        ] = await pool.getReserveData(asset_addr)

        let data = new Array()

        // get deposit APY
        const supplyRate = currentLiquidityRate.toBigInt()
        const supplyRateNumber = Number(supplyRate)
        console.log("supply rate", supplyRateNumber)
        const depositAPR = supplyRateNumber / RAY
        const depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1

        // get stable borrow APY
        const stableRate = (currentStableBorrowRate.toBigInt())
        const stableRateNumber = Number(stableRate)
        console.log(stableRateNumber)
        const stableRateAPR = stableRateNumber / RAY
        console.log("st", stableRateAPR)
        const stableBorrowAPY = ((1 + (stableRateAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1

        data.push(depositAPY * 100)
        data.push(stableBorrowAPY * 100)
        data.push(aTokenAddress)
        data.push(stableDebtTokenAddress)
        return data
    } catch (error) {
        console.error(error);
    }
}

/**
 * Supplies an amount of underlying asset into the reserve, receiving in return overlying aTokens.
    E.g. User supplies 100 DAI and gets in return 100 aDAI
 * @param referralCode: optional default to 0 
 */
export async function depositToAave(assetAddr, amount, referralCode = 0, provider, account) {
    try {
        const pool = await getPoolContractWrite(provider);
        //approve amount to deposit in the aave vault
        const erc20Contract = await getERC20ContractWrite(assetAddr, provider)
        const tx_approve = await erc20Contract.approve(pool.address, amount)
        await tx_approve.wait();
        //deposit amount into the aave vault
        const tx_deposit = await pool.supply(assetAddr, amount, account, referralCode)
        return await tx_deposit.wait();
    } catch (error) {
        console.error(error)
    }
}

/**
 * Withdraws an amount of underlying asset from the reserve, 
 * burning the equivalent aTokens owned 
 */
export async function withdrawFromAave(assetAddr, amount, addrTo, provider) {
    try {
        const pool = await getPoolContractWrite(provider);
        const tx_withdraw = await pool.withdraw(assetAddr, amount, addrTo)
        return await tx_withdraw.wait()
    } catch (error) {
        console.error(error)
    }
}

/**
 * Deposit ETH using WethGateway
 */
export async function depositETHtoAave(onBehalfOf, referralCode = 0, provider, amount) {
    try {
        const pool = await getPoolContract(provider);
        const contract = new ethers.Contract(data.networks.rinkeby.wethGateway, IWETHGateway.abi, provider.getSigner())
        const tx = await contract.depositETH(pool.address, onBehalfOf, referralCode, { value: amount })
        return await tx.wait()
    } catch (error) {
        console.error(error)
    }
}

/**
 * Withdraw ETH using WethGateway
 */
export async function withdrawETHfromAave(onBehalfOf, provider, amount) {
    try {
        const pool = await getPoolContract(provider);
        const contract = new ethers.Contract(data.networks.rinkeby.wethGateway, IWETHGateway.abi, provider.getSigner())
        const aweth = await getERC20ContractWrite(data.networks.rinkeby.aWETH, provider)
        const tx_approve = await aweth.approve(contract.address, amount)
        await tx_approve.wait()
        console.log("approve tx", tx_approve)
        const tx = await contract.withdrawETH(pool.address, amount, onBehalfOf)
        console.log(tx)
        return await tx.wait()
    } catch (error) {
        console.error(error)
    }
}