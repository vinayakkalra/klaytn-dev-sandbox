import { useForm } from 'react-hook-form'
import { useState, useContext, useEffect } from 'react'
import providerContext from '../context/context'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Tooltip } from 'flowbite-react'
import Web3 from 'web3'

interface props {
    projectid: any,
    projectabi: any
}

const ipfsConn = {
    host: 'ipfs.infura.io',
    port: 5001,
    https: true,
    projectId: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_KEY,
    projectSecret: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
}

type FormData = {
    amount: number
}

interface props {
    projectid: any,
    projectabi: any,
    getProjects: any
}

const ProjectCard = ({ projectid, projectabi, getProjects }: props) => {
    const { caver, kaikasAddress } = useContext(providerContext)
    const [data, setData] = useState([])
    const [metadata, setMetadata] = useState({})
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
        reset
    } = useForm<FormData>()

    console.log('projectid', projectid)
    console.log('projectabi', projectabi)

    const initCaverIPFS = async () => {
        const options = caver.ipfs.createOptions({ projectId: ipfsConn.projectId, projectSecret: ipfsConn.projectSecret });
        await caver.ipfs.setIPFSNode(ipfsConn.host, ipfsConn.port, ipfsConn.https, options)
    }

    const getProjectData = async () =>{
        // const id = toast.loading('Fetching Project Data...', { theme: 'colored' })
        const project = new caver.klay.Contract(projectabi, projectid)
        if (!project) {
            // toast.update(id, {
            //     render: 'Contract of ' + projectid + ' Not found',
            //     type: 'error',
            //     autoClose: 3000,
            //     isLoading: false,
            // })
            alert("Error with project data rendering")
        } else {
            
            try {
                const projectData = await project.methods.getProjectData().call()
                console.log('Project Data for :' + projectid, projectData)
                setData(projectData)
                initCaverIPFS();

                const ipfsData = await caver.ipfs.get(projectData[2])
                const jsonString = Buffer.from(ipfsData).toString('utf8')

                const parsedData = JSON.parse(jsonString)
                console.log('parsedData', parsedData)

                setMetadata(parsedData)

                // toast.update(id, {
                //     render: 'Project',
                //     type: 'success',
                //     autoClose: 3000,
                //     isLoading: false,
                // })
            } catch (err: any) {
                // toast.update(id, {
                //     render: err.message,
                //     type: 'error',
                //     autoClose: 3000,
                //     isLoading: false,
                // })
                console.log("Error with getProjectData")

            }
        }
    }
    useEffect(() => {getProjectData()}, [])

    const contribute = async () => {
        const id = toast.loading('Contributing to Project...', { theme: 'colored' })
        const project = new caver.klay.Contract(projectabi, projectid)
        
        if (!project) {
            toast.update(id, {
                render: 'Contract not deployed yet',
                type: 'error',
                autoClose: 3000,
                isLoading: false,
            })
        } else {
            const amount = getValues('amount')
            
            if (!amount ) {
                alert('Please do not leave any fields blank.')
                return
            }
            try {
                const contributeToProject = await project.methods
                    .contribute()
                    .send({ from: kaikasAddress,value: caver.utils.toPeb(amount, 'KLAY') , gas: '0xF4240' })
                console.log('createProject txn: ', contributeToProject)
                toast.update(id, {
                    render: 'You have successfully contributed',
                    type: 'success',
                    autoClose: 3000,
                    isLoading: false,
                })
                reset();
                getProjects()
            } catch (err: any) {
                toast.update(id, {
                    render: err.message,
                    type: 'error',
                    autoClose: 3000,
                    isLoading: false,
                })
            }
        }
    }

    if(data.length == 0){
        return(
            <div></div>
        )
    }else{
        console.log('data', data)
        return (
            <div className="shadow-md space-y-2 w-1/2 p-2 m-auto rounded-lg">
                <h2 className="md:text-sm text-xs text-gray-500 font-body tracking-wider">{metadata.name}</h2>
                <p className="md:text-sm text-xs text-gray-500 font-body tracking-wider">Minimum Amount to contribute : {Web3.utils.fromWei(String(data[0]))} KLAY</p>
                <p className="md:text-sm text-xs text-gray-500 font-body tracking-wider">Total Current Contributions : {Web3.utils.fromWei(String(data[3]))} KLAY</p>
                <div className="grid grid-cols-1">
                    <label className="md:text-sm text-xs text-gray-500 font-body tracking-wider">
                        Contribution amount (In KLAY)
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
                    {...register('amount', { required: true })}
                    />
                </div>
                <button
                    className="bg-magma text-white tracking-widest font-header py-2 px-8 rounded-full"
                    onClick={() => { contribute() }}
                >
                    Contribute
                </button>
            </div>
        )
    }
    
}

export default ProjectCard
