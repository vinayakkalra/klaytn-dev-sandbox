import type { NextPage } from 'next'
import { useState, useEffect, useContext } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import KIP7 from '../components/KIP7'
import KIP17 from '../components/KIP17'
import KIP37 from '../components/KIP37'
import CrowdFunding from '../components/CrowdFunding'
import providerContext from '../context/context'
import { ToastContainer, toast } from 'react-toastify'

const Contracts: NextPage = ({
  kip7abi,
  kip7address,
  kip17abi,
  kip17address,
  kip37abi,
  kip37address,
  factoryaddress,
  factoryabi,
  projectabi
}: any) => {
  const [currentContract, setCurrentContract] = useState('KIP7')
  const { web3, caver } = useContext(providerContext)
  const [kip7, setKip7] = useState()
  const [kip17, setKip17] = useState()
  const [kip37, setKip37] = useState()
  const [factory, setFactory] = useState()

  const metamaskContractValidity = async () => {
    const code = await web3.eth.getCode(kip7address)
    return code === '0x' ? false : true
  }

  const caverContractValidity = async () => {
    try {
      const code = await caver.klay.getCode(kip7address)
      return code === '0x' ? false : true
    } catch (err) {
      console.error('error checking contract validity')
    }
  }

  const instantiateKlayContracts = async () => {
    const valid: boolean | any = await caverContractValidity()
    if (valid) {
      if (kip7address && kip7abi) {
        const kip7Contract = new caver.klay.Contract(kip7abi, kip7address)
        setKip7(kip7Contract)
      }
      if (kip17address && kip17abi) {
        const kip17Contract = new caver.klay.Contract(kip17abi, kip17address)
        setKip17(kip17Contract)
      }
      if (kip37address && kip37abi) {
        const kip37Contract = new caver.klay.Contract(kip37abi, kip37address)
        setKip37(kip37Contract)
      }
      if (factoryaddress && factoryabi) {
        const factoryContract = new caver.klay.Contract(factoryabi, factoryaddress)
        setFactory(factoryContract)
      }
    }
  }

  const instantiateEthContracts = async () => {
    const valid: boolean = await metamaskContractValidity()

    if (valid) {
      if (kip7address && kip7abi) {
        const kip7Contract = new web3.eth.Contract(kip7abi, kip7address)
        setKip7(kip7Contract)
      }
      if (kip17address && kip17abi) {
        const kip17Contract = new web3.eth.Contract(kip17abi, kip17address)
        setKip17(kip17Contract)
      }
      if (kip37address && kip37abi) {
        const kip37Contract = new web3.eth.Contract(kip37abi, kip37address)
        setKip37(kip37Contract)
      }
      if (factoryaddress && factoryabi) {
        const factoryContract = new web3.eth.Contract(factoryabi, factoryaddress)
        setFactory(factoryContract)
      }
    }
    // else {
    //   alert('Please connect wallet to the network of your deployed contracts')
    // }
  }

  useEffect(() => {
    if (web3) {
      instantiateEthContracts()
    }
  }, [web3])

  useEffect(() => {
    if (caver) {
      instantiateKlayContracts()
    }
  }, [caver])

  return (
    <div className="mt-10">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex justify-center space-x-10 text-2xl font-bold text-gray-800">
        {currentContract === 'KIP7' ? (
          <button
            className="border-b-2 border-white border-grey bg-gray-100 px-3 py-1 rounded-md"
            onClick={() => {
              setCurrentContract('KIP7')
            }}
          >
            KIP7
          </button>
        ) : (
          <button
            className="border-b-2 border-white px-3 py-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setCurrentContract('KIP7')
            }}
          >
            KIP7
          </button>
        )}
        {currentContract === 'KIP17' ? (
          <button
            className="border-b-2 border-white border-grey bg-gray-100 px-3 py-1 rounded-md"
            onClick={() => {
              setCurrentContract('KIP17')
            }}
          >
            KIP17
          </button>
        ) : (
          <button
            className="border-b-2 border-white px-3 py-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setCurrentContract('KIP17')
            }}
          >
            KIP17
          </button>
        )}
        {currentContract === 'KIP37' ? (
          <button
            className="border-b-2 border-white border-grey bg-gray-100 px-3 py-1 rounded-md"
            onClick={() => {
              setCurrentContract('KIP37')
            }}
          >
            KIP37
          </button>
        ) : (
          <button
            className="border-b-2 border-white px-3 py-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setCurrentContract('KIP37')
            }}
          >
            KIP37
          </button>
        )}
        {currentContract === 'funding' ? (
          <button
            className="border-b-2 border-white border-grey bg-gray-100 px-3 py-1 rounded-md"
            onClick={() => {
              setCurrentContract('funding')
            }}
          >
            CrowdFunding
          </button>
        ) : (
          <button
            className="border-b-2 border-white px-3 py-1 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setCurrentContract('funding')
            }}
          >
            CrowdFunding
          </button>
        )}
      </div>
      <div className="mt-14">{currentContract === 'KIP7' && <KIP7 kip7={kip7} />}</div>
      <div className="mt-14">{currentContract === 'KIP17' && <KIP17 kip17={kip17} />}</div>
      <div className="mt-14">{currentContract === 'KIP37' && <KIP37 kip37={kip37} />}</div>
      <div className="mt-14">{currentContract === 'funding' && <CrowdFunding factory={factory} projectabi={projectabi} />}</div>
    </div>
  )
}

export default Contracts

export async function getStaticProps() {
  const contractsDirectory = path.join(process.cwd(), 'deployed')
  let kip7address
  let kip7abi
  let kip17address
  let kip17abi
  let kip37address
  let kip37abi
  let factoryaddress
  let factoryabi
  let projectabi
  let props = {}

  try {
    const kip7addressPath = path.join(contractsDirectory, 'kip7TokenAddress')
    kip7address = await fs.readFile(kip7addressPath, 'utf8')
    const kip7abiPath = path.join(contractsDirectory, 'kip7TokenABI')
    const kip7abiContents = await fs.readFile(kip7abiPath)
    kip7abi = JSON.parse(kip7abiContents.toString())
    props = { ...props, kip7address: kip7address, kip7abi: kip7abi }
  } catch (err) {
    console.log('error fetching kip7', err)
  }

  try {
    const kip17addressPath = path.join(contractsDirectory, 'kip17TokenAddress')
    kip17address = await fs.readFile(kip17addressPath, 'utf8')
    const kip17abiPath = path.join(contractsDirectory, 'kip17TokenABI')
    const kip17abiContents = await fs.readFile(kip17abiPath)
    kip17abi = JSON.parse(kip17abiContents.toString())
    props = { ...props, kip17address: kip17address, kip17abi: kip17abi }
  } catch (err) {
    console.log('error fetching kip17', err)
  }

  try {
    const kip37addressPath = path.join(contractsDirectory, 'kip37TokenAddress')
    kip37address = await fs.readFile(kip37addressPath, 'utf8')
    const kip37abiPath = path.join(contractsDirectory, 'kip37TokenABI')
    const kip37abiContents = await fs.readFile(kip37abiPath)
    kip37abi = JSON.parse(kip37abiContents.toString())
    props = { ...props, kip37address: kip37address, kip37abi: kip37abi }
  } catch (err) {
    console.log('error fetching ki317', err)
  }

  try {
    const factoryaddressPath = path.join(contractsDirectory, 'factoryaddress')
    factoryaddress = await fs.readFile(factoryaddressPath, 'utf8')
    const factoryabiPath = path.join(contractsDirectory, 'factoryabi')
    const factoryabiContents = await fs.readFile(factoryabiPath)
    factoryabi = JSON.parse(factoryabiContents.toString())
    const projectabiPath = path.join(contractsDirectory, 'projectabi')
    const projectabiContents = await fs.readFile(projectabiPath)
    projectabi = JSON.parse(projectabiContents.toString())
    console.log({factoryaddress: factoryaddress, factoryabi: factoryabi, projectabi: projectabi})
    props = { ...props, factoryaddress: factoryaddress, factoryabi: factoryabi, projectabi: projectabi }
  } catch (err) {
    console.log('error fetching ki317', err)
  }

  return {
    props,
  }
}
