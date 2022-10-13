import { useForm } from 'react-hook-form'
import { useState, useContext, useEffect } from 'react'
import providerContext from '../context/context'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Tooltip } from 'flowbite-react'
import ProjectCard from './ProjectCard'

const ipfsConn = {
    host: 'ipfs.infura.io',
    port: 5001,
    https: true,
    projectId: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_KEY,
    projectSecret: process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
}

type FormData = {
    name: string
    description: string
    minimum: number
    target: number
}

interface props {
    factory: any,
    projectabi: any
}

const CrowdFunding = ({ factory, projectabi }: props) => {
    const { caver, kaikasAddress } = useContext(providerContext)
    const [imageURL, setImageURL] = useState('')
    const [projects, setProjects] = useState([])
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
        const options = caver.ipfs.createOptions({ projectId: ipfsConn.projectId, projectSecret: ipfsConn.projectSecret });
        await caver.ipfs.setIPFSNode(ipfsConn.host, ipfsConn.port, ipfsConn.https, options)
    }

    const createProject = async () => {
        const id = toast.loading('Creating Project...', { theme: 'colored' })
        console.log(factory)
        if (!factory) {
            toast.update(id, {
                render: 'Contract not deployed yet',
                type: 'error',
                autoClose: 3000,
                isLoading: false,
            })
        } else {
            const name = getValues('name')
            const description = getValues('description')
            const minimum = getValues('minimum')
            const target = getValues('target')
            if (!name || !description || !minimum || !target) {
                alert('Please do not leave any fields blank.')
                return
            }
            const metadata = { name: name, description: description, minimum: minimum, target: target }

            await initCaverIPFS()
            const cid = await caver.ipfs.add(Buffer.from(JSON.stringify(metadata)).buffer)

            const uri = `https://ipfs.io/ipfs/${cid}`
            console.log('token URI: ', uri)
            try {
                const createProject = await factory.methods
                    .createProject(caver.utils.toPeb(minimum, 'KLAY'), caver.utils.toPeb(target, 'KLAY'), cid)
                    .send({ from: kaikasAddress, gas: '0xF4240' })
                console.log('createProject txn: ', createProject)
                toast.update(id, {
                    render: 'You have successfully created a project',
                    type: 'success',
                    autoClose: 3000,
                    isLoading: false,
                })
                reset();
                deleteMedia();
                getProjects();
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

    // const onFileUpload = async (e: any) => {
    //     const file = e.target.files[0]
    //     try {
    //         setIsLoading(true)
    //         console.log(`adding ${file.name} to ipfs....`)

    //         await initCaverIPFS()
    //         const reader = new FileReader()
    //         reader.addEventListener('load', async (event) => {
    //             if (event && event.target && event.target.result != null) {
    //                 const cid = await caver.ipfs.add(event.target.result)

    //                 const url = `https://ipfs.io/ipfs/${cid}`
    //                 console.log('ipfs url: ', url)
    //                 setImageURL(url)
    //                 setValue('image', url)
    //                 setIsLoading(false)
    //             } else {
    //                 alert('No content!')
    //             }
    //         })
    //         reader.readAsArrayBuffer(file)
    //     } catch (e) {
    //         console.error('Error uploading file: ', e)
    //     }
    // }

    const deleteMedia = () => {
        setImageURL('')
    }

    const getProjects = async () => {
        const id = toast.loading('Fetching Projects...', { theme: 'colored' })
        if (!factory) {
            toast.update(id, {
                render: 'Contract not deployed yet',
                type: 'error',
                autoClose: 3000,
                isLoading: false,
            })
        } else {
            
            try {
                const getProjectsFromFactory = await factory.methods
                    .getProjects()
                    .call()
                console.log('All Projects from factory', getProjectsFromFactory)
                setProjects(getProjectsFromFactory)
                toast.update(id, {
                    render: 'Projects Loaded',
                    type: 'success',
                    autoClose: 3000,
                    isLoading: false,
                })
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

    useEffect(() => {getProjects()}, [])

    useEffect(() => { }, [imageURL])

    return (
        <div className='grid grid-cols-2'>
            <div className="flex justify-center">

                <form className="space-y-6 w-1/2">
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
                            Minimum Amount to Contribute
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
                            {...register('minimum', { required: true })}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <label className="md:text-sm text-xs text-gray-500 font-body tracking-wider">
                            Target Amount
                        </label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            className="text-gray-500 border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
                            {...register('target', { required: true })}
                        />
                    </div>

                    {isLoading && (
                        <div className="flex justify-center">
                            <Spinner />
                        </div>
                    )}
                    <div className="flex items-center justify-center pt-5 pb-5">
                        <button
                            className="bg-magma text-white tracking-widest font-header py-2 px-8 rounded-full"
                            onClick={handleSubmit(createProject)}
                        >
                            Create Project
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
            <div className="justify-center space-y-6">
                {
                    projects.map((key, index) => {
                        return <ProjectCard projectabi={projectabi} key={index} projectid={key} getProjects={()=> {
                            getProjects()
                        }} />
                    })
                }
                
            </div>
            
        </div>

    )
}

export default CrowdFunding
