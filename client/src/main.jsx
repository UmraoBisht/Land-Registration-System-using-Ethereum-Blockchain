import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegistrationForm from './components/RegistrationForm.jsx';
import LandingPage from './components/LandingPage.jsx';
import App from './App.jsx';
import AddLand from './components/AddLand.jsx';
import Admin from './components/Admin.jsx';
import LandPurchaseRequest from './components/LandPurchaseRequest.jsx';
import AllLands from './components/AllLands.jsx';
import OwnedLands from './components/OwnedLands.jsx';
import LandApproveRequests from './components/LandApproveRequests.jsx';
import TransferLandRequest from './components/TransferLandRequest.jsx';
import ApproveTransferLandRequests from './components/ApproveTransferLandRequests.jsx';
import TransferRejects from './components/TransferRejects.jsx';
import RegistrationRejects from './components/RegistrationRejects.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element:
      <App />
    ,
    children: [
      {
        path: "/dashboard",
        element: <AddLand />,
      },
      {
        path: "mylands",
        element: <OwnedLands />,
      },
      {
        path: "trasferlandrequest",
        element: <TransferLandRequest />,
      },
      {
        path: "registrationlandrejects",
        element: <RegistrationRejects />,
      },
      {
        path: "transferlandrejects",
        element: <TransferRejects />,
      },
    ]
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "/admin",
        element: <LandApproveRequests />,
      },
      {
        path: "alltransferrequests",
        element: <ApproveTransferLandRequests />,
      },
      {
        path: "allLands",
        element: <AllLands />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
