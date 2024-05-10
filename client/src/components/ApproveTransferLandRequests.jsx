import React, { useEffect, useState } from "react";
import Web3 from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";
import toast, { Toaster } from "react-hot-toast";

function ApproveTransferLandRequests() {
  const [allTransferRequests, setAllTransferRequests] = useState([]);
  const [landId, setLandId] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [reasonWindow, setReasonWindow] = useState("hidden");
  const [reason, setReason] = useState("");

  useEffect(() => {
    async function loadTransferRequests() {
      try {
        const web3 = new Web3(window.ethereum);
        const LandRegistrySystemContract = new web3.eth.Contract(
          LandRegistrySystemABI.abi,
          LandRegistrySystemABI.networks[5777].address
        );
        const accounts = await web3.eth.getAccounts();
        const transferRequests = await LandRegistrySystemContract.methods
          .getAllTransferRequests()
          .call({ from: accounts[0] });
          const uniqueArray = transferRequests.filter((transferRequest, index, self) =>
          index === self.findIndex((t) => (
              t.id === transferRequest.id
          ))
      );
        setAllTransferRequests(uniqueArray);
        // console.log(transferRequests);
      } catch (error) {
        console.log(error);
      }
    }

    loadTransferRequests();
  }, []);

  const approveRequestHandler = async (landId, currentOwner) => {
    try {
      const web3 = new Web3(window.ethereum);
      const LandRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      const accounts = await web3.eth.getAccounts();
      await LandRegistrySystemContract.methods
        .approveTransferRequest(landId, currentOwner)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
      toast.success("Land Successfully Deleted!", {
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

  const toggleTransferRejectWindow = (landId, ownerAddress) => {
    setLandId(landId);
    setOwnerAddress(ownerAddress);
    setReasonWindow("flex");
  };

  const transferLandRejectHandler = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const LandRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      const accounts = await web3.eth.getAccounts();
      const result=await LandRegistrySystemContract.methods
        .rejectTransferRequest(landId, ownerAddress, reason)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
        console.log(result);
      toast.success("Land Transfer Request Rejected Successfully!", {
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

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        Transfer Requests
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300 text-center">
          <tr>
            <th scope="col" className="px-6 py-3">
              Previous Owner
            </th>
            <th scope="col" className="px-6 py-3">
              New Owner
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
              Government Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {allTransferRequests.map((transferRequest, index) => (
            <tr
              className="bg-white border-b text-black hover:bg-gray-200 "
              key={index}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {transferRequest.previous_owner.slice(0, 6)}...
                {transferRequest.previous_owner.slice(-4)}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {transferRequest.new_owner.slice(0, 6)}...
                {transferRequest.new_owner.slice(-4)}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {transferRequest.land_id.toString()}
              </th>
              <td className="px-6 py-4">{transferRequest.location}</td>
              <td className="px-6 py-4">{transferRequest.area.toString()}</td>
              <td className="px-6 py-4">
                {transferRequest.govt_approved ? (
                  <p className="text-blue-600">Approved</p>
                ) : (
                  <p className="text-red-600">Not Approved</p>
                )}
              </td>
              <td className="px-6 py-4 flex flex-wrap flex-shrink justify-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={() => {
                    approveRequestHandler(
                      transferRequest.land_id.toString(),
                      transferRequest.previous_owner
                    );
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() =>
                    toggleTransferRejectWindow(
                      transferRequest.land_id.toString(),
                      transferRequest.previous_owner
                    )
                  }
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
                onClick={() => setReasonWindow("hidden")}
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
            <div className="p-4 md:p-5">
              <form
                className="space-y-4"
                action="#"
                onSubmit={(e) => {
                  transferLandRejectHandler(e);
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
                    defaultValue={landId}
                    placeholder="Land ID"
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="ownerAddress"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Owner Address
                  </label>
                  <input
                    type="text"
                    name="ownerAddress"
                    id="ownerAddress"
                    defaultValue={ownerAddress}
                    placeholder="Land ID"
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
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => rejectLandHandler()}
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

export default ApproveTransferLandRequests;
