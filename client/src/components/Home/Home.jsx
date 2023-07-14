import './Home.css';
import React, {useState} from 'react';
import landingVector from "../../assets/LV.png";
import Header from '../partials/Header/Header';
import { Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reduxSlices/authSlice';
import LoginModal from '../partials/LoginModal/LoginModal';
const Home = () => {
  const userData = useSelector(selectUserData);
  const [show, setShow] = useState(false);
  const toggle = () => setShow(prevState=>!prevState);
  return (
    <div className="landing"> 
      <Header/>
      <section id="hero">
        <div className="container pt-4">
          <div className="row">
            <div className="col-lg-6 pt-5 pt-lg-0 mb-5 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <div>
                <h3 class="shiro">Team IN-CTRL</h3>
                <p></p>
                <h1><strong>Inquest: All in One<br/> Research Assistant</strong></h1>
                <p></p>
                <h3>We help students and researchers by making the research<br/> process easier, streamlined, efficient and organised.</h3>
                <p></p><p></p>
                  {
                    (userData.token) ? 
                      (<Link to="workspace" className="btn-get-started scrollto">Start Researching</Link>) : 
                      (<button className="btn-get-started scrollto" onClick={() => setShow(true)}>Start Researching</button>)
                  }
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 svg-1 aos-init aos-ani0 FloatImg" data-aos="fade-left">
              <img src={landingVector} className="img-fluid animated tho" alt="" />
            </div>
          </div>
        </div>
      </section>
      {/* <div className="Footer mt-3">
        <div className="row p-0 m-0">
            <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start px-0 py-2">
                <div className="Footer_Copyright pe-2 pe-md-4 ms-0 ms-md-5 fw-bold">
                  <CopyrightIcon style={{fontSize: "16px", marginTop: "-5px"}}/> Learner's Space 2022
                </div>
                <div className="ms-0 ms-md-4 ps-2 ps-md-0">
                  learnerspace@gmail.com
                </div>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-end py-2">
              <span className="px-2">
                <FacebookIcon />
              </span>
              <span className="px-2">
                <InstagramIcon/>
              </span>
              <span className="px-2">  
                <TwitterIcon/>
              </span>
              <span className="px-2">
                <MailOutlineIcon/>
              </span>
            </div>
        </div>
      </div> */}
      <LoginModal isModalOpen={show} toggleModal={toggle} setShow={setShow}/>
    </div>
  );
}
  
export default Home;