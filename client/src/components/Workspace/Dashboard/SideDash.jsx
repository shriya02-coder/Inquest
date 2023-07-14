import React, { useState } from 'react';
import "./Dashboard.css";
import {Link} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import CreateWorkspace from '../CreateWorkspace'; 
import JoinWorkspace from '../JoinWorkspace';


const SideDash = (props) => {
  const [show, setShow] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const toggle = () => setShow(prevState=>!prevState);
  const toggleJoin = () => setShowJoin(prevState=>!prevState);
  const owned = props.owned;
  const enrolled = props.enrolled;
  const [seeAllOwned , setSeeAllOwned] = useState(false);
  const [seeAllEnrolled , setSeeAllEnrolled] = useState(false);
  return (
    <div className="col-3 d-none d-md-block Dashboard_Sidedrawer px-1 ps-4 width-20">
     <div className="Sidedrawer_Class d-flex p-4 ps-2">
      <div className="row join-links pt-3">
      <div className="col-12 d-flex justify-content-center pb-3">
          <p> <center>Don't Need a Workspace ?</center> <br/> <center> Choose one of the options below to directly find papers and utlise the features of Inquest</center> </p>
        </div>
      <div className="col-12 d-flex justify-content-center pb-3">
          <button className="nor-btn">
            Find Papers
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center pb-3">
          <button className="nor-btn">
            Upload Papers
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center pb-3">
          <button className="join-create-btn" onClick={() => setShowJoin(true)}>
            <AddIcon className="pe-1 mb-1"></AddIcon>
            Join Workspace
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center pb-3">
          <button className="join-create-btn" onClick={() => setShow(true)}>
          <AddIcon className="pe-1 mb-1"></AddIcon>
            Create Workspace
          </button>
        </div>
      </div>
      <CreateWorkspace isModalOpen={show} toggleModal={toggle} setShow={setShow}/>
      <JoinWorkspace isModalOpen={showJoin} toggleModal={toggleJoin} setShow={setShowJoin}/>
    </div>
    </div>
  );
}

export default SideDash;
