import { Web3ReactProvider } from "@web3-react/core"
import Home from ".";
import { Web3Provider } from "@ethersproject/providers"
import { injected } from "../connectors";


function getLibrary(provider) {
  return new Web3Provider(provider);
}


function MyApp({ Component, pageProps }) {
  return (

    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  )
}

export default MyApp
