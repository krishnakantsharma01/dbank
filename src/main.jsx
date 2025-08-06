import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'

import { WagmiProvider, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

// ✅ wagmi config with RainbowKit + WalletConnect project ID
const config = getDefaultConfig({
  appName: 'EtherBank',
  projectId: '009a5125069bb56f589c3fc2e97282e2', // Make sure this is active on WalletConnect
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
})

// ✅ Create query client (for caching contract reads)
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[sepolia]}
          theme={darkTheme()}
          modalSize="compact"
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)