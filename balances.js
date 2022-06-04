import { ethers } from 'ethers'
import * as erc20 from "./brownie_build/interfaces/IERC20.json"

// Erc balances
async function getBalanceErc20(provider, account, erc_addr) {
    try {
        const contract = new ethers.Contract(erc_addr, erc20.abi, provider);
        return (await contract.balanceOf(account));
    } catch (error) {
        console.error(error);
    }
}

// get user balances, returns erc balances if erc addr is passed, eth balacnes else
export async function userBalances(erc_addr, provider, account) {
    if ((erc_addr !== "ether") && erc_addr !== undefined) {
        const value = await getBalanceErc20(provider, account, erc_addr)
        const balance = value.toBigInt()
        return ethers.utils.formatEther(balance)
    } else {
        const value = await provider.getBalance(account)
        return ethers.utils.formatEther(value)
    }
}