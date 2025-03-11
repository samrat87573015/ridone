import React from "react";

import HeaderTop from "./header/top";
import HeaderMiddle from "./header/middle";
import Headerbottom from "./header/bottom";
import Mobileheader from "./header/mobileheader";
import MobileSidebar from "./header/MobileSidebar";
import SidebarButton from "./header/SidebarButton";
import { useState } from "react";
export default function Header() {

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);



  return (
    <>
      <div className="border-bottom header">
       <HeaderTop/>
       <HeaderMiddle />
       <Headerbottom/>

     
   
      </div>

      
      <Mobileheader/>

     
    </>
  );
}
