import { Link, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { MdAddLocationAlt } from "react-icons/md";
import { BiSolidLandscape } from "react-icons/bi";
// import { BsFillFileEarmarkMinusFill } from "react-icons/bs";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
// import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
// import { defineChain } from "thirdweb/chains";
// import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
// export const client = createThirdwebClient({ 
//   clientId: "87d5406df38214fac0178fca43be6443" 
// });

// // connect to your contract
// export const contract = getContract({ 
//   client, 
//   chain: defineChain(11155111), 
//   address: "0x1542f6ed3b3a4E4Bc69D2ABba056CD1431361F22"
// });


function App() {
  return (
    // <ThirdwebProvider>
    <>
      <Navbar />
      <div className="flex pt-16 w-full h-screen bg-white">
        <div className="w-[20%] bg-white h-full rounded-md">
          <h4 className="font-semibold text-xl mx-3 my-2 pt-2">Dashboard</h4>
          <div className="flex flex-col gap-2">
            <Link
              className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center gap-2"
              to="/dashboard"
            >
              <MdAddLocationAlt />
              Add Land
            </Link>
            <Link
              className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center gap-2"
              to="registrationlandrejects"
            >
              <BsFillFileEarmarkPlusFill />
              Registration Rejects
            </Link>

            <Link
              className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center gap-2"
              to="trasferlandrequest"
            >
              <BsFillFileEarmarkPlusFill />
              My Transfer Requests
            </Link>
            <Link
              className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center gap-2"
              to="transferlandrejects"
            >
              <BsFillFileEarmarkPlusFill />
              Transfer Rejects
            </Link>
            <Link
              className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center gap-2"
              to="mylands"
            >
              <BiSolidLandscape />
              My Lands
            </Link>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}

// {/* </ThirdwebProvider> */}
export default App;
