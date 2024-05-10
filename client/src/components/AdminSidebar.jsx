import React from "react";
import { BiSolidLandscape } from "react-icons/bi";
import {
  BsFillFileEarmarkMinusFill,
  BsFillFileEarmarkPlusFill,
} from "react-icons/bs";
import { MdAddLocationAlt } from "react-icons/md";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-[20%] bg-white h-full rounded-md">
      <h4 className="font-semibold text-xl mx-3 my-2">Dashboard</h4>
      <div className="flex flex-col gap-2">
        <Link
          className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center flex-col text-center gap-2"
          to="/admin"
        >
          <MdAddLocationAlt />
          <p>Land Registration Requests</p>
        </Link>
        <Link
          className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center flex-col text-center gap-2"
          to="alltransferrequests"
        >
          <MdAddLocationAlt />
          <p>All Transfer Requests</p>
        </Link>
        <Link
          className="bg-cyan-300 px-3 py-2 mx-3 my-2 rounded-md hover:bg-cyan-400 flex justify-center items-center flex-col text-center gap-2"
          to="allLands"
        >
          <BiSolidLandscape />
          <p>All Lands</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
