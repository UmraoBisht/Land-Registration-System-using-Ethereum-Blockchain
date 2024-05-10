import React, { useEffect, useState } from "react";
import Web3 from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";

function RegistrationRejects() {
  const [registrationRejectedLands, setRegistrationRejectedLands] = useState([])
  useEffect(() => {
    async function loadRegisterationRejects() {
      try {
        const web3 = new Web3(window.ethereum);
        const LandRegistrySystemContract = new web3.eth.Contract(
          LandRegistrySystemABI.abi,
          LandRegistrySystemABI.networks[5777].address
        );
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        const registrationRejectedLandsResult =
          await LandRegistrySystemContract.methods
            .getRejectedRegistrationLandForUser()
            .call({from:accounts[0]});
        console.log(registrationRejectedLandsResult);
        setRegistrationRejectedLands(registrationRejectedLandsResult);
      } catch (error) {
        console.log(error);
      }
    }
    loadRegisterationRejects();
  }, []);

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        Rejected Registration Lands
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300 text-center">
          <tr>
            <th scope="col" className="px-6 py-3">
              Land Id
            </th>
            <th scope="col" className="px-6 py-3">
              Reason
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {registrationRejectedLands.map((registrationRejectedLand, index) => (
            <tr
              className="bg-white border-b text-black hover:bg-gray-200 "
              key={index}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {registrationRejectedLand.landId.toString()}
              </th>
              <td className="px-6 py-4">{registrationRejectedLand.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistrationRejects;
