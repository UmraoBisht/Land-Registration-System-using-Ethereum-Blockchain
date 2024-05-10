import { useState } from "react";
import Web3 from "web3";
import toast, { Toaster } from "react-hot-toast";
import LandRegistrySystemABI from "../../../build/contracts/LandRegistrySystem.json"; // Import ABI

export default function AddLand() {
  const [landId, setLandId] = useState(null);
  const [area, setArea] = useState(null);
  const [location, setLocation] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [isIploading, setIsIploading] = useState(false);

  const handleRegisterLand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      localStorage.setItem("accounts", accounts);
      const landRegistrySystemContract = new web3.eth.Contract(
        LandRegistrySystemABI.abi,
        LandRegistrySystemABI.networks[5777].address
      );
      const result = await landRegistrySystemContract.methods
        .registerLand(landId, area, location, ipfsHash)
        .send({ from: accounts[0], gas: 6721975, gasPrice: 20000000000 });
      console.log(result);
      toast.success("Land Successfully  Registered!", {
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
      toast.error("Something went worng...");
      console.log(error);
    } finally {
      setLoading(false);
      e.target.reset();
    }
  };

  const changeFileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadhandler = async () => {
    try {
      setIsIploading(true);
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
      setIsIploading(false);
    }
  };

  return (
    <div className="w-full overflow-auto pt-16 flex justify-center items-center flex-col">
      <h4 className="font-semibold text-xl mx-3 my-2 pb-2">Add Land</h4>
      <form
        className="bg-white w-full h-screen shadow-md rounded px-8 pt-4 pb-8 mb-4"
        onSubmit={(e) => handleRegisterLand(e)}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="adminId"
          >
            Land ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="adminId"
            type="text"
            placeholder="adminId"
            onChange={(e) => setLandId(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            placeholder="location"
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="area"
          >
            Area(Sq.mt)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="area"
            type="text"
            placeholder="Area"
            onChange={(e) => setArea(parseInt(e.target.value))}
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
          <div className="flex justify-between">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="documents"
              type="file"
              onChange={changeFileHandler}
              required
            />

            {isIploading ? (
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
          {loading ? (
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
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}
