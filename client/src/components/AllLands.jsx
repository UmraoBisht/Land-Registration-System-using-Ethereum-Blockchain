import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";
// const contract_Address=process.env.CONTRACT_DELPOY_ADDRESS
function AllLands() {
  let [allLands, setAllLands] = useState([]);

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
          .getAllLands()
          .call({from:accounts[0]});
        console.log(lands);
        setAllLands(lands);
      } catch (error) {
        console.log(error);
      }
    }
    loadLands();
  }, []);

  const editWindowHandler = () => {};

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        All Lands
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300">
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
              Government Status
            </th>
          </tr>
        </thead>
        <tbody>
          {allLands.map((land,index) => (
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
              <td className="px-6 py-4">
                {land.is_govt_approved ? (
                  <p className="text-blue-600">Approved</p>
                ) : (
                  <p className="text-red-600">Not Approved</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllLands;
