import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CONTRACT_ADDRESS, ABI } from './contract'

function App() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')

  // ✅ Reading balance from the contract
  const { data: balance, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'balances',
    args: [address],
    watch: true,
    pollingInterval: 5000 // Optional: refresh every 5 sec
  })

  // ✅ Writing to the contract (deposit/withdraw)
  const { writeContractAsync } = useWriteContract()

  // ✅ Deposit Function
  const handleDeposit = async () => {
    try {
      const valueInWei = BigInt(Number(amount) * 1e18)
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'deposit',
        value: valueInWei
      })

      setAmount('')

      // Delay and then refetch to get updated balance
      setTimeout(() => {
        refetch()
      }, 3000)
    } catch (error) {
      console.error('Deposit failed:', error)
    }
  }

  // ✅ Withdraw Function
  const handleWithdraw = async () => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'withdraw'
      })

      // Delay and then refetch to get updated balance
      setTimeout(() => {
        refetch()
      }, 3000)
    } catch (error) {
      console.error('Withdraw failed:', error)
    }
  }

  return (
   <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
    padding: '1rem',
    boxSizing: 'border-box',
    perspective: '1000px',
  }}
>
  <div
    style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      maxWidth: '480px',
      background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
      borderRadius: '20px',
      boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.15), -5px -5px 15px #ffffff',
      textAlign: 'center',
      transform: 'rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-in-out',
    }}
  >
    <h1
      style={{
        fontSize: '1.8rem',
        marginBottom: '1.5rem',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      💰 EtherBank
    </h1>

    <ConnectButton />

    {isConnected && (
      <>
        <p
          style={{
            margin: '1rem 0',
            fontSize: '1.05rem',
            color: '#333',
            textShadow: '1px 1px 1px #fff',
          }}
        >
          <strong>Your contract balance:</strong>{' '}
          {balance ? (Number(balance) / 1e18).toFixed(4) : '0.0000'} ETH
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <input
            type="number"
            placeholder="Enter amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: '12px',
              fontSize: '1rem',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '10px',
              boxSizing: 'border-box',
              boxShadow: 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
              background: '#f0f0f3',
              outline: 'none',
            }}
          />

          <button
            onClick={handleDeposit}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: '#0070f3',
              color: 'white',
              boxShadow: '2px 4px 10px rgba(0, 112, 243, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '4px 6px 15px rgba(0, 112, 243, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '2px 4px 10px rgba(0, 112, 243, 0.3)';
            }}
          >
            Deposit
          </button>

          <button
            onClick={handleWithdraw}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: '#e63946',
              color: 'white',
              boxShadow: '2px 4px 10px rgba(230, 57, 70, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '4px 6px 15px rgba(230, 57, 70, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '2px 4px 10px rgba(230, 57, 70, 0.3)';
            }}
          >
            Withdraw
          </button>
        </div>
      </>
    )}
  </div>
</div>


  )
}

export default App