import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";
import toast, { Toaster } from "react-hot-toast";

function TransferLandRequest() {
  const [landTransferRequests, setLandTransferRequests] = useState([]);

  useEffect(() => {
    async function loadLandTransferRequests() {
      try {
        const web3 = new Web3(window.ethereum);
        const LandRegistrySystemContract = new web3.eth.Contract(
          LandRegistrySystemABI.abi,
          LandRegistrySystemABI.networks[5777].address
        );

        const accounts = await web3.eth.getAccounts();
        const getLandTransferRequests = await LandRegistrySystemContract.methods
          .getTransferredLands()
          .call({ from: accounts[0] });
        setLandTransferRequests(getLandTransferRequests);
      } catch (error) {
        console.log(error);
      }
    }
    loadLandTransferRequests();
  }, []);

  const deleteHandler = async (landId) => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const LandRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      await LandRegistrySystemContract.methods
        .deleteTransferRequestsForLand(landId)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });;
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

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        My Transfer Requests
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300">
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
          {landTransferRequests.map((landTransferRequest) => (
            <tr
              className="bg-white border-b text-black hover:bg-gray-200 "
              key={landTransferRequest.land_id}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {landTransferRequest.previous_owner.slice(0, 6)}...
                {landTransferRequest.previous_owner.slice(-4)}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {landTransferRequest.new_owner.slice(0, 6)}...
                {landTransferRequest.new_owner.slice(-4)}
              </th>
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {landTransferRequest.land_id.toString()}
              </th>
              <td className="px-6 py-4">{landTransferRequest.location}</td>
              <td className="px-6 py-4">
                {landTransferRequest.area.toString()}
              </td>
              <td className="px-6 py-4">
                {landTransferRequest.govt_approved ? (
                  <p className="text-blue-600">Approved</p>
                ) : (
                  <p className="text-red-600">Not Approved</p>
                )}
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => {
                    deleteHandler(landTransferRequest.land_id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}

export default TransferLandRequest;
