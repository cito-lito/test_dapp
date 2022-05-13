import { InjectedConnector } from '@web3-react/injected-connector'
/*
Chains:
Rinkeby : 4
KOvan : 42
*/

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137, 80001, 42161, 421611]
})