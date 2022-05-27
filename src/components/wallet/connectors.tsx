import { InjectedConnector } from '@web3-react/injected-connector'
//import { InjectedConnector } from '@kaikas-connector'

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 203, 1001, 8217],
})

// export const injectedKaikas = new InjectedConnector({
//   supportedChainIds: [1, 3, 4, 5, 42, 203, 1001, 8217],
// })