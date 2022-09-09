import { useForm } from 'react-hook-form'
import { useState, useContext, useEffect } from 'react'
import providerContext from '../context/context'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Tooltip } from 'flowbite-react'

const ipfsConn = {
  host: 'ipfs.infura.io',
  port: 5001,
  https: true,
  projectId: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_KEY ,
  projectSecret: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
}

type FormData = {
  name: string
  description: string
  image: string
  quantity: number
}

interface props {
  kip37: any
}

const KIP37 = ({ kip37 }: props) => {
  const { caver, kaikasAddress } = useContext(providerContext)
  const [imageURL, setImageURL] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>()

  const initCaverIPFS = async () => {
    const options = caver.ipfs.createOptions({projectId: ipfsConn.projectId, projectSecret: ipfsConn.projectSecret, options});
    await caver.ipfs.setIPFSNode(ipfsConn.host, ipfsConn.port, ipfsConn.https)
  }

  const mintToken = async () => {
    const id = toast.loading('Minting Tokens....', { theme: 'colored' })
    if (!kip37) {
      toast.update(id, {
        render: 'Contract not deployed yet',
        type: 'error',
        autoClose: 3000,
        isLoading: false,
      })
    } else {
      const name = getValues('name')
      const description = getValues('description')
      const image = getValues('image')
      const quantity = getValues('quantity')
      if (!name || !description || !image || !quantity) {
        alert('Please do not leave any fields blank.')
        return
      }
      const metadata = { name: name, description: description, image: image, quantity: quantity }

      await initCaverIPFS()
      const cid = await caver.ipfs.add(Buffer.from(JSON.stringify(metadata)).buffer)

      const uri = `https://ipfs.infura.io/ipfs/${cid}`
      console.log('token URI: ', uri)
      try {
        const mintTxn = await kip37.methods
        .mintToken(uri, quantity)
        .send({ from: kaikasAddress, gas: '0xF4240' })
      console.log('mint txn: ', mintTxn)
      toast.update(id, {
        render: 'Token(s) successfully minted',
        type: 'success',
        autoClose: 3000,
        isLoading: false,
      })
      reset();
      deleteMedia();
      } catch (err:any) {
        toast.update(id, {
          render: err.message,
          type: 'error',
          autoClose: 3000,
          isLoading: false,
        })
      }
    }
  }

  const onFileUpload = async (e: any) => {
    const file = e.target.files[0]
    try {
      setIsLoading(true)
      console.log(`adding ${file.name} to ipfs....`)

      await initCaverIPFS()
      const reader = new FileReader()
      reader.addEventListener('load', async (event) => {
        if (event && event.target && event.target.result != null) {
          const cid = await caver.ipfs.add(event.target.result)

          const url = `https://ipfs.infura.io/ipfs/${cid}`
          console.log('ipfs url: ', url)
          setImageURL(url)
          setValue('image', url)
          setIsLoading(false)
        } else {
          alert('No content!')
        }
      })
      reader.readAsArrayBuffer(file)
    } catch (e) {
      console.error('Error uploading file: ', e)
    }
  }

  const deleteMedia = () => {
    setImageURL('')
  }

  useEffect(() => {}, [imageURL])

  return (
    <div className="flex justify-center">
      <form className="space-y-6 w-1/4">
        {/* <div className="flex justify-center text-2xl">Mint KIP37 NFT</div> */}
        <div className="flex justify-center  mb-10">
          <Tooltip content="Link to the documentation">
            <a
              href="https://github.com/Krustuniverse-Klaytn-Group/klaytn-dev-sandbox#deploying-contracts"
              target="_blank"
              rel="noreferrer"
            >
              <Button>How to use the KIP37 NFT </Button>
            </a>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1">
          <label className="md:text-sm text-xs text-gray-500 font-body tracking-wider">Name</label>
          <input
            className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            type="text"
            {...register('name', { required: true })}
          />
        </div>
        <div className="grid grid-cols-1">
          <label className="md:text-sm text-xs text-gray-500 font-body tracking-wider">
            Description
          </label>
          <textarea
            className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            {...register('description', { required: true })}
          />
        </div>
        <div className="grid grid-cols-1">
          <label className="md:text-sm text-xs text-gray-500 font-body tracking-wider">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            step="1"
            className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            {...register('quantity', { required: true })}
          />
        </div>
        {imageURL ? (
          <div className="flex justify-center">
            <img src={imageURL} width="300px" height="300px" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full mt-2">
            <label className="flex flex-col border-2 border-dashed border-gray-400 w-full rounded-lg h-32 group">
              <div className="flex flex-col items-center justify-center p-8 cursor-pointer">
                <svg
                  className="w-10 h-10 group-hover:text-gray-500"
                  fill="none"
                  stroke="grey"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-400 group-hover:text-gray-500 pt-1 tracking-wider">
                  Select media (jpg, png, gif)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpeg,.jpg,.png,.gif"
                onChange={onFileUpload}
              />
            </label>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
        <div className="flex items-center justify-center pt-5 pb-5">
          <button
            className="bg-magma text-white tracking-widest font-header py-2 px-8 rounded-full"
            onClick={handleSubmit(mintToken)}
          >
            MINT KIP37 TOKEN
          </button>
          <button
            className="bg-magma text-white tracking-widest font-header mx-3 py-2 px-8 rounded-full hover:bg-grey-400 "
            onClick={deleteMedia}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default KIP37
