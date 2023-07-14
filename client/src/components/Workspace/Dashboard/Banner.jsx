import React, { Component } from 'react';
import "./Dashboard.css";

import banner from "../../../assets/ba.png";
import { useSelector } from 'react-redux';
import { selectUserData} from '../../../reduxSlices/authSlice';

const Banner = () => {
  const storeData = useSelector(selectUserData);
  return (
    <>
      <div className="col-12 px-0 px-md-3">
        <div className="row banner m-0">
            <div className="col-6 d-flex justify-content-center flex-column ps-5">
            <p></p>
              <div className="hello-name d-none d-md-block">
                Hello, {" "+storeData.userName+" "}!
              </div>
              <p></p>
              <p className="hello-description d-none d-md-block">
                Create Workspaces and start researching efficently
              </p>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <img src={banner} alt="" srcset="" width="50%"/>
            </div>
        </div>
      </div>
    </>
  );
}

export default Banner;