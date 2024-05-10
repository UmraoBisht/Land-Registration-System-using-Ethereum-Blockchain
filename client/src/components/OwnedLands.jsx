import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json";
import toast, { Toaster } from "react-hot-toast";

function OwnedLands() {
  const [ownedLands, setOwnedLands] = useState([]);
  const [landRegistryContract, setLandRegistryContract] = useState();
  const [landId, setLandId] = useState();
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [toggleDisplay, setToggleDisplay] = useState("hidden");
  const [toggleEditDisplay, setToggleEditDisplay] = useState("hidden");
  const [accounts, setAccounts] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [ipfsHash, setIpfsHash] = useState("");
  const [editLandId, setEditLandId] = useState(null);
  useEffect(() => {
    async function loadOwnedLands() {
      try {
        const web3 = new Web3(window.ethereum);
        const LandRegistrySystemContract = new web3.eth.Contract(
          LandRegistrySystemABI.abi,
          LandRegistrySystemABI.networks[5777].address
        );
        setLandRegistryContract(LandRegistrySystemContract);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        setAccounts(accounts);
        let ownedLandResult = await LandRegistrySystemContract.methods
          .getOwnedLands()
          .call({ from: accounts[0] });
        console.log(ownedLandResult);
        setOwnedLands(ownedLandResult);
        setLandId(ownedLandResult.landId);
      } catch (error) {
        console.log(error);
      }
    }
    loadOwnedLands();
  }, []);

  const editModalHandler = (_landId,_ownerAddress) => {
    setEditLandId(_landId);
    setToggleEditDisplay("flex");
  };

  const transferLandModalHandler = (_landId) => {
    setEditLandId(_landId);
    console.log(_landId);
    setToggleDisplay("flex");
  };

  const transferLandHandler = async (e) => {
    try {
      e.preventDefault();
      console.log("landID => %s \n Address => %s",editLandId,newOwnerAddress);
      await landRegistryContract.methods
        .createTransferRequest(editLandId,newOwnerAddress)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
        setToggleDisplay("hidden");
        toast.success("Land Transfer Request Successfully Sent!", {
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
    }finally{
      e.target.reset();
    }
  };

  const saveEditLandHandler = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await landRegistryContract.methods
        .updateLand(landId, ipfsHash)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
      toast.success("Land Successfully Edited!", {
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
      setToggleEditDisplay("hidden");
    } catch (error) {
      toast.error("Something went worng...");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadhandler = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "Land" + landId,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setIpfsHash(resData.IpfsHash);
      toast.success("Document successfully Uploaded!", {
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
      console.log(resData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pt-3 overflow-x-auto shadow-md sm:rounded-lg w-full">
      <h5 className="font-semibold text-xl mx-3 my-2 pb-2 text-center">
        Lands
      </h5>
      <table className="w-full text-sm text-left rtl:text-right text-black ">
        <thead className="text-xs text-black uppercase bg-cyan-300 text-center">
          <tr>
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
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {ownedLands.map((ownedLand,index) => (
            <tr
              className="bg-white border-b text-black hover:bg-gray-200 "
              key={index}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-black"
              >
                {ownedLand.land_id.toString()}
              </th>
              <td className="px-6 py-4">{ownedLand.location}</td>
              <td className="px-6 py-4">{ownedLand.area.toString()}</td>

              <td className="px-6 py-4">
                <a
                  href={`https://ipfs.io/ipfs/${ownedLand.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Docs
                </a>
              </td>
              <td className="px-6 py-4">
                {ownedLand.is_govt_approved ? (
                  <p className="text-blue-600">Approved</p>
                ) : (
                  <p className="text-red-600">Not Approved</p>
                )}
              </td>
              <td className="px-6 py-4 text-center flex justify-center">
                <button
                  data-modal-target="authentication-modal"
                  data-modal-toggle="authentication-modal"
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={()=>editModalHandler(ownedLand.land_id.toString())}
                >
                  Edit
                </button>
                <button
                  type="button"
                  data-modal-target="authentication-modal"
                  data-modal-toggle="authentication-modal"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={()=>transferLandModalHandler(ownedLand.land_id.toString())}
                >
                  Transfer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        tabindex="-1"
        aria-hidden="true"
        className={`${toggleEditDisplay} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Land
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={() => setToggleEditDisplay("hidden")}
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form
                className="bg-white w-full shadow-md rounded px-8 pt-4 pb-8 mb-4"
                onSubmit={(e) => saveEditLandHandler(e)}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="landId"
                  >
                    Land ID
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="landId"
                    type="text"
                    placeholder="Land ID"
                    defaultValue={editLandId}
                    disabled
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="documents"
                  >
                    Documents
                  </label>
                  <div className="flex justify-between gap-2">
                    <input
                      className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="documents"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      required
                    />

                    {isUploading ? (
                      <button
                        type="button"
                        disabled
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                      >
                        Uploading...
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                        onClick={uploadhandler}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {isUpdating ? (
                    <button
                      disabled
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        tabindex="-1"
        aria-hidden="true"
        className={`${toggleDisplay} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transfer Land
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setToggleDisplay("hidden")}
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
              <form className="space-y-4" action="#" onSubmit={(e)=>{transferLandHandler(e)}}>
                <div>
                  <label
                    for="landId"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Land ID
                  </label>
                  <input
                    type="text"
                    name="landId"
                    id="landId"
                    placeholder="Land ID"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    defaultValue={editLandId}
                    disabled
                    required
                  />
                </div>
                <div>
                  <label
                    for="newOwnerAddress"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Owner Address
                  </label>
                  <input
                    type="text"
                    name="newOwnerAddress"
                    id="newOwnerAddress"
                    placeholder="0xdc0803e16........0cb49534a005"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Transfer
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

export default OwnedLands;
