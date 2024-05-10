import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";
import toast, { Toaster } from "react-hot-toast";

function LandApproveRequests() {
  const [allLands, setAllLands] = useState([]);
  const [landId, setLandId] = useState('');
  const [reasonWindow, setReasonWindow] = useState("hidden");
  const [reason,setReason]=useState('');
  useEffect(() => {
    async function loadLands() {
      try {
        const web3 = new Web3(window.ethereum);
        const LandRegistrySystemContract = new web3.eth.Contract(
          LandRegistrySystemABI.abi,
          LandRegistrySystemABI.networks[5777].address
        );
        const accounts = await web3.eth.getAccounts();
        const lands = await LandRegistrySystemContract.methods
          .getNonApprovedLands()
          .call({ from: accounts[0] });
        setAllLands(lands);
      } catch (error) {
        console.log(error);
      }
    }
    loadLands();
  }, []);

  const approveRequestHandler = async (landId) => {
    try {
      const web3 = new Web3(window.ethereum);
      const LandRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      const accounts = await web3.eth.getAccounts();
      await LandRegistrySystemContract.methods
        .approveLand(landId)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
      toast.success("Land Approved Successfully!", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };


  const toggleReasonWindow=(landId)=>{
    console.log(landId);
    setLandId(landId);
    setReasonWindow("flex");
  }

  const rejectLandHandler=async()=>{
    try {
      const web3 = new Web3(window.ethereum);
      const LandRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      const accounts = await web3.eth.getAccounts();
      await LandRegistrySystemContract.methods
        .rejectLandRegistration(landId,reason)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
      toast.success("Land Registration Rejected Successfully!", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        Land Approve Requests
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300 text-center">
          <tr>
            <th scope="col" className="px-6 py-3">
              Owner
            </th>
            <th scope="col" className="px-6 py-3">
              Land Id
            </th>
            <th scope="col" className="px-6 py-3">
              Location
            </th>
            <th scope="col" className="px-6 py-3">
              Area(Sq.mt)
            </th>
            <th scope="col" className="px-6 py-3">
              Documents
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {allLands.map((land, index) => (
            <tr
              className="bg-white border-b text-black hover:bg-gray-200 "
              key={index}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {land.current_owner.slice(0, 6)}...
                {land.current_owner.slice(-4)}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {land.land_id.toString()}
              </th>
              <td className="px-6 py-4">{land.location}</td>
              <td className="px-6 py-4">{land.area.toString()}</td>

              <td className="px-6 py-4">
                <a
                  href={`https://ipfs.io/ipfs/${land.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Docs
                </a>
              </td>
              <td className="px-6 py-4 flex flex-wrap flex-shrink justify-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={() => {
                    approveRequestHandler(land.land_id.toString());
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={()=>{toggleReasonWindow(land.land_id.toString())}}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        tabIndex="-1"
        aria-hidden="true"
        className={`${reasonWindow} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Enter Reason For Rejection
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {setReasonWindow("hidden")}}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="p-4 md:p-5">
              <form
                className="space-y-4"
                action="#"
                onSubmit={(e) => {
                  rejectLandHandler(e);
                }}
              >
                <div>
                  <label
                    htmlFor="landId"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Land ID
                  </label>
                  <input
                    type="text"
                    name="landId"
                    id="landId"
                    placeholder="Land ID"
                    defaultValue={landId}
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="reasonForReject"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Reason
                  </label>
                  <input
                    type="text"
                    name="reasonForReject"
                    id="reasonForReject"
                    placeholder="Enter Reason Here..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) => {setReason(e.target.value)}}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}
export default LandApproveRequests;
