import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PropagateLoader } from 'react-spinners'
import Header from '../components/Header'
import Loading from '../components/Loading'
import Login from '../components/Login'
import { ethers } from 'ethers'
import { currency } from '../constants'
import CountdownTimer from '../components/CountdownTimer'
import toast from 'react-hot-toast'
import Marquee from 'react-fast-marquee'
import AdminControls from '../components/AdminControls'
import DataTable, { TableColumn }  from 'react-data-table-component'


/* const columns = [{
  dataField: 'amount',
  text: 'Product ID'
}, {
  dataField: 'amount',
  text: 'Hash'
}, {
  dataField: 'amount',
  text: 'From '
}];
 */
type DataRow = {
  hash: string, 
  from: string, 
  to: string, 
  amount: number,
  checkLink: string
}
const transactions: Array<DataRow> = [
  {
      "hash": "0x51f055039bec9c2621abce089ae68c0d37468f534c5385e7e21f514a0e96bbfe",
      "from": "0x0000000000000000000000000000000000000000",
      "to": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "amount": 100000,
      "checkLink": "https://goerlietherscan.io/tx/0x51f055039bec9c2621abce089ae68c0d37468f534c5385e7e21f514a0e96bbfe"
  },
  {
      "hash": "0x97ffbe1f3100b7992f03032dcd7d0c36bd07423f7f78f8f513364a1872c2f35e",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x97ffbe1f3100b7992f03032dcd7d0c36bd07423f7f78f8f513364a1872c2f35e"
  },
  {
      "hash": "0xce2ea1bbdcf938306f3ed11078939e88d8d6d68cddedd36d7e44dd1eb04f4328",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0xce2ea1bbdcf938306f3ed11078939e88d8d6d68cddedd36d7e44dd1eb04f4328"
  },
  {
      "hash": "0x1528f2e287a3af17e88253ddabd69386b68709d1340be3698aef6b4e3c739ac3",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x1528f2e287a3af17e88253ddabd69386b68709d1340be3698aef6b4e3c739ac3"
  },
  {
      "hash": "0x4c820fac05790e99f0b5d8c9967a28c4ab541503eaa8227889d44ff8ad3cbd9a",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x4c820fac05790e99f0b5d8c9967a28c4ab541503eaa8227889d44ff8ad3cbd9a"
  },
  {
      "hash": "0x2cf174f397bd5263fbedaaea40818db92b5b8fd94867fd5e21202ab4709236bc",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x2cf174f397bd5263fbedaaea40818db92b5b8fd94867fd5e21202ab4709236bc"
  },
  {
      "hash": "0x10b13914ddadd5e078eabe28cc02268c19bf48d29e26863f2fa1ef34d4e17ce1",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x10b13914ddadd5e078eabe28cc02268c19bf48d29e26863f2fa1ef34d4e17ce1"
  },
  {
      "hash": "0x9949955ba382a4ccd204abd3a16972422c03ab28288205ec33ee42c91716fa6d",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x9949955ba382a4ccd204abd3a16972422c03ab28288205ec33ee42c91716fa6d"
  },
  {
      "hash": "0xe6a922fc9d1c10128bfab867155fe7d998586ed2123a7adc4c80285a59db7e46",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0xe6a922fc9d1c10128bfab867155fe7d998586ed2123a7adc4c80285a59db7e46"
  },
  {
      "hash": "0x16fd5ab2b8e0a8d262bbed353229b2f648b78477fbbd34b4af6fedcbdb2c0a63",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x16fd5ab2b8e0a8d262bbed353229b2f648b78477fbbd34b4af6fedcbdb2c0a63"
  },
  {
      "hash": "0x91cb129ae9dd7e4cf7b86743ce1626b2e535d70a7cb4a196d784c6bd3bc453ea",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x91cb129ae9dd7e4cf7b86743ce1626b2e535d70a7cb4a196d784c6bd3bc453ea"
  },
  {
      "hash": "0x318f419c71fb248e58546b440760947b0a82d621bb5b61e43d3d223c31c28053",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x318f419c71fb248e58546b440760947b0a82d621bb5b61e43d3d223c31c28053"
  },
  {
      "hash": "0xa7cb5abd99b7239e954235ce221b8940484a732a540d38d42a5b772d640cb90b",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0xa7cb5abd99b7239e954235ce221b8940484a732a540d38d42a5b772d640cb90b"
  },
  {
      "hash": "0x6d9c0995fef2a4fffeb2d179aabc48b7832d68df1d766b8f13571ed06a99d90d",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 0,
      "checkLink": "https://goerlietherscan.io/tx/0x6d9c0995fef2a4fffeb2d179aabc48b7832d68df1d766b8f13571ed06a99d90d"
  },
  {
      "hash": "0xfacaac7e30f5ad442e4b0236acdbd9e00f8032c3b0a96d4fea1661a9c4253182",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "amount": 100,
      "checkLink": "https://goerlietherscan.io/tx/0xfacaac7e30f5ad442e4b0236acdbd9e00f8032c3b0a96d4fea1661a9c4253182"
  },
  {
      "hash": "0xe8a2dd02ee4c99e4d1c6c075f95551dd681c1c45c55a36389061285e798e1174",
      "from": "0xd36Dd7cabF457cE317FDA21c0525ed4561D5C352",
      "to": "0x59a0ECC4Dcf48ab54D24e038eF05fc68AAC5486b",
      "amount": 200,
      "checkLink": "https://goerlietherscan.io/tx/0xe8a2dd02ee4c99e4d1c6c075f95551dd681c1c45c55a36389061285e798e1174"
  }
]


const columns: TableColumn<DataRow>[] =  [
    {
        name: 'Hash',
        selector: row =>
         row.hash.substring(0,8)+"..."+row.hash.substring(row.hash.length, row.hash.length - 8),
    },
    {
        name: 'From',
        selector: row => 
        row.from.substring(0,8)+"..."+row.from.substring(row.from.length, row.from.length - 8),
    },
    {
      name: 'To',
      selector: row => 
      row.to.substring(0,8)+"..."+row.to.substring(row.to.length, row.to.length - 8),
  },
  {
    name: 'Amount',
    selector: row => row.amount,
},
{
  name: 'CheckLink',
  selector: row => 
  row.checkLink.substring(0,8)+"..."+row.checkLink.substring(row.checkLink.length, row.checkLink.length - 8),
},
]; 

const dataForTable = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

const Home: NextPage = () => {
  const address = useAddress()
  const [userTickets, setUserTickets] = useState(0)
  //const [transactions, setTransactions] =  useState([])
  const [quantity, setQuantity] = useState<number>(1)
  console.log("my addressssssss : ",address);
  const {contract, isLoading} = useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS)
  console.log('contracttttttttt', contract);

  const {data: remainingTickets} = useContractRead(contract, "RemainingTickets")
  const {data: currentWinningReward} = useContractRead(contract, "CurrentWinningReward")
  const {data: ticketPrice} = useContractRead(contract, "ticketPrice")
  const {data: ticketCommission} = useContractRead(contract, "ticketCommission")
  const {data: expiration} = useContractRead(contract, "expiration")
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")
  const {data: tickets} = useContractRead(contract, "getTickets")
  const {data: winnings} = useContractRead(contract, "getWinningAddress", address)
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings")
  const {data: lastWinner} = useContractRead(contract, "lastWinner")
  const {data: lastWinnerAmount} = useContractRead(contract, "lastWinnerAmount")
  const {data: isLotteryOperator} = useContractRead(contract, "lotteryOperator")

  useEffect(() => {
    //callAPI();
    
    if(!tickets) return
    const totalTickets: string[] = tickets
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total+1 :
      total),
      0
      )

      setUserTickets(noOfUserTickets)
  }, [tickets, address])
  console.log('noOfUserTickets : ', userTickets)
  
  const handleClick = async () => {
    if(!ticketPrice) return
    const notification = toast.loading("Buying your tickets...")
    try {
      const data = await BuyTickets([
        {
        value: ethers.utils.parseEther(
          (
          Number(ethers.utils.formatEther(ticketPrice)) * quantity)
          .toString()
        ),
      },
    ])
      toast.success("Tickets purchased successfully!", {
        id: notification,
      })
    } catch (error) {
      toast.error("Whoaps something went wrong!", {
        id: notification,
      })
      console.log("Contract call failure ", error);
      
    }
  }
  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...")
    try {
      const data = await WithdrawWinnings([{}])
      toast.success("Withdraw winnings successfully!", {
              id: notification,
      })
    } catch (error) {
      toast.error("Whoaps something went wrong", {
        id: notification
      })
    }
  }

  const callAPI = async () => {
    const res = await fetch('http://192.168.1.149/transactions');

    const newdata = await res.json();
    //setTransactions(newdata.transactions)

    //console.log('test data : ', transactions);
    
    /* try {
        const res = await fetch(
            `https://famous-quotes4.p.rapidapi.com/random?category=all&count=2`,
            {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'your-rapidapi-key',
                    'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
                },
            }
        );
        const data = await res.json();
        console.log('test data : ', data);
    } catch (err) {
        console.log('the error : ', err);
    } */
};


  if(isLoading) return <Loading />
  if(!address) return <Login />

  return (
    <div className='bg-[#091B18] min-h-screen flex flex-col'>
       <Head>
        <title>VSII TOKEN</title>
       </Head>
        <Header />
        
       {/*  <Marquee className='bg-[#0A1F1C] p-5 mb-5' gradient={false} speed={100}>
          <div className='flex space-x-2 mx-10'>
            <h4 className='text-white font-bold'> Last Winner : {lastWinner?.toString()}</h4>
            <h4 className='text-white font-bold'>Previous winnings: {
            lastWinnerAmount && 
            ethers.utils.formatEther(lastWinnerAmount?.toString())} {" "} {currency}</h4>
          </div>
        </Marquee> */}
        {isLotteryOperator === address && (
          <div className='flex justify-center'>
            <AdminControls />
          </div>
        ) }
        {winnings > 0 && (
          <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
            <button onClick={onWithdrawWinnings}
            className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600
            animate-pulse text-center rounded-xl w-full'>
              <p className='font-bold'>Winner winner chicken dinner!</p>
              <p className=''>Total Winnings: {ethers.utils.formatEther(winnings
              .toString())} {" "} {currency}</p>
              <br />
              <p></p>
            </button>
          </div>
        )}
        {/* The Next draw box*/}

        

        <div className='space-y-5 md:space-y-0 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <DataTable
          className=''
            columns={columns}
            data={transactions}
            selectableRows
            />
          {/* <BootstrapTable keyField='id' data={transactions } columns={ columns } /> */}
     

         
          {/* <div className='stats-container'>
            
            <h1 className='text-5xl text-white font-semibold text-center'>The Next draw </h1>
          
            <div className='flex justify-between p-2 space-x-2'>
              <div className='stats'>
                <h2 className='text-sm'>Total Pool </h2>
                <p className='text-xl'>{currentWinningReward &&  
                ethers.utils.formatEther(currentWinningReward.toString())} {" "} {currency}</p>
              </div>
              <div className='stats'>
                  <h2 className='text-sm'>Tickets Remaining</h2>
                  <p className='text-xl'>{remainingTickets?.toNumber()}</p>
              </div>
            </div>
           
            <div className='mt-5 mb-3'>
                <CountdownTimer />
            </div>
         
        </div> */}
        {/* <div className="stats-container space-y-2">
          <div className="stats-container">
            <div className="flex justify-between items-center text-white pb-2 ">
              <h2 className=''>Price per ticker</h2>
              <p> {ticketPrice && 
              ethers.utils.formatEther(ticketPrice.toString())} {" "} {currency}</p>
            </div> 
            <div className='flex text-white items-center space-x-2 bg-[#091B18]
             border-[#091B18] border p-4'>
              <p>TICKETS</p>
              <input className='flex w-full bg-transparent text-right online-none'
               type="number"
               min={1}
               max={10}
               value={quantity}
               onChange={(e) => {setQuantity(Number(e.target.value))}}
              />
            </div>
            <div className='space-y-2 mt-5'>
              <div className='flex items-center justify-between
              text-emerald-300 text-sm italic font-extrabold'>
                <p>Total cost of tickets</p>
                <p>{ticketPrice &&  
              Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity}{" "} {currency}</p>
              </div>
              <div className='flex items-center justify-between
              text-emerald-300 text-sm italic font-extrabold'>
                <p>Service fees</p>
                <p>{ticketCommission && 
              ethers.utils.formatEther(ticketCommission.toString())} {" "} {currency}</p>
              </div>
              <div className='flex items-center justify-between
              text-emerald-300 text-xs italic'>
                <p>+ Network fees</p>
                <p>TBC</p>
              </div>
            </div>
            <button
            onClick={handleClick}
            disabled={expiration?.toString() < Date.now().toString() ||
            remainingTickets?.toNumber() === 0}
            className='mt-5 w-full bg-gradient-to-br
            from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white
            shadow-xl disabled:from-gray-600 disabled:to-gray-600 
            disabled:text-gray-100 font-semibold
            disabled:cursor-not-allowed'>Buy {quantity} tickets for
            {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString()))
            * quantity} {" "} {currency}
             </button>
          </div>
          {userTickets > 0 &&(
            <div className='stats'>
              <p className='text-lg mb-2'>You have {userTickets} tickets in this draw</p>
              <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                {Array(userTickets).fill("").map((_, index) => (
                  <p key={index} className="text-emerald-300
                  h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0
                  items-center justify-center italic text-xs">{index+1}</p>
                ))}
              </div>
            </div>
          ) }
        </div> */}
        </div>
        
       
        {/* The price per ticket box */}
        <div></div>

    </div>
   
  )
}

export default Home
