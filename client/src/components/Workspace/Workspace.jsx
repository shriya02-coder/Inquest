import React, { useState, useEffect } from "react";
import "./Workspace.css";
import { useParams, useHistory, useLocation } from "react-router-dom";
import MobileHeader from "../partials/Header/MobileHeader";
import Header from "../partials/Header/Header";
import FooterNav from "../partials/FooterNav/FooterNav";
import { getDateFromTimestamp, getTimeFromTimestamp } from "../../utilities";
import Drafts from './Drafts';
import Collaborators from "./Collaborators";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Button } from 'reactstrap';
import CreateDraft from "./WritePaper/CreateDraft";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUserData } from '../../reduxSlices/authSlice';
import CircularProgress from "@material-ui/core/CircularProgress";
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import FindPaper from "./FindPaper/FindPaper";
import UploadPaper from "./UploadPaper/UploadPaper";
const Workspace = () => {
  const storeData = useSelector(selectUserData);
  const history = useHistory();
  const location = useLocation().pathname;
  const classCode = useParams().id;
  const [className, setClassName] = useState();
  const [adminName, setAdminName] = useState();
  const [adminEmail, setAdminEmail] = useState();
  const [reminders, setReminders] = useState([]);
  const [seeAll, setSeeAll] = useState(false);
  const [activeTab, setActiveTab] = useState(useParams().tab);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);
  const toggle = () => setShow(prevState => !prevState);
  const [loading, setLoading] = useState(false);
  const [isDraftCreated, setIsDraftCreated] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  useEffect(() => {
    if (!activeTab) setActiveTab("drafts");
    if (activeTab === "drafts") {
      history.replace('/workspace/' + classCode + '/drafts');
    } else if (activeTab === "collaborators") {
      history.replace('/workspace/' + classCode + '/find');
    } else if (activeTab === "collaborators") {
      history.replace('/workspace/' + classCode + '/upload');
    } else if (activeTab === "collaborators") {
      history.replace('/workspace/' + classCode + '/collaborators');
    }
  }, [activeTab])
  const toggle_dropdown = () => setDropdownOpen(prevState => !prevState);
  useEffect(() => {
    setLoading(true);
    // axios Request for getting className, adminName, adminEmail, year, subject
    axios.post("http://localhost:5000/workspace/getWorkspace", {
      classCode: classCode
    }, { headers: { Authorization: 'Bearer ' + storeData.token } }
    )
      .then((res) => {
        setClassName(res.data.className);
        setAdminName(res.data.adminName);
        setAdminEmail(res.data.adminEmail);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
        history.replace('/workspace');
      })

  }, []);

  useEffect(async () => {
    if (storeData.token) {
      setReminderLoading(true);
      axios.post("http://localhost:5000/workspace/getReminders", {
        userEmail: storeData.userEmail
      }, { headers: { Authorization: 'Bearer ' + storeData.token } }
      )
        .then(async (res) => {
          let reminders = [];
          for (let reminder of res.data) {
            await axios.post("http://localhost:5000/workspace/getWorkspace", {
              classCode: reminder.classCode
            })
              .then(classDetails => {
                reminders.push({ ...reminder, className: classDetails.data.className });
              })
              .catch(err => {
                console.log(err);
              })
          }
          setReminders(reminders);
          setReminderLoading(false);
        })
        .catch(err => {
          console.log(err);
          setReminderLoading(false);
        })
    }
  }, [storeData.token])

  const deleteClass = () => {
    axios.delete("http://localhost:5000/workspace/deleteWorkspace", {
      data: { classCode: classCode }
    }, { headers: { Authorization: 'Bearer ' + storeData.token } }
    )
      .then((res) => {
        console.log("deleted");
        history.push("/workspace");
      })
      .catch(err => { console.log(err.response); })
  }

  return (
    <>
      {(!loading) ? (
        <div className="Workspace">
          <div className="d-none d-md-block">
            <Header />
          </div>
          <div className="d-block d-md-none">
            <MobileHeader />
          </div>
          <div className="row m-0 justify-content-center">
            <div className="Workspace_Info col-11 col-md-10 col-lg-9 col-xl-11 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
              <div className="d-flex newBar">
                <div className="Horizontal_Line"></div>
                <div className="d-flex flex-column">
                  <div>
                    <h2 className="ClassName ms-1">{className}</h2>
                  </div>
                  <div className="d-flex Workspace_Desc">
                    <div className="Side_Border">Admin Name: {adminName}</div>
                  </div>
                  <div className="Class_Code mt-4 mb-2">
                    Workspace Code - <b>{classCode}</b>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column justify-content-between">
                {
                  (adminName === storeData.userName) ? (
                    <Dropdown className="me-2" isOpen={dropdownOpen} toggle={toggle_dropdown}>
                      <DropdownToggle nav>
                        <MoreHorizIcon />
                      </DropdownToggle>
                      <DropdownMenu className="bg-transparent" style={{ border: "none" }}>
                        <div> <button className="join-create-btn" onClick={deleteClass}>
                          Delete Workspace
                        </button></div>
                        <div> <button className="join-create-btn" onClick={deleteClass}>
                          Edit Workspace
                        </button></div>
                      </DropdownMenu>
                    </Dropdown>
                  ) : ""
                }
              </div>
            </div>
            <div className="col-12 col-md-10 col-lg-9 col-xl-11">
              <div className="row d-flex">
                <div className="d-flex justify-content-between Workspace_Navtab mt-4">
                  <div
                    onClick={() => setActiveTab("drafts")}
                    className={activeTab === "drafts" ? "active" : ""}
                  >
                    Write Paper
                  </div>
                  <div
                    // onClick={() => setActiveTab("find")}
                    className={activeTab === "find" ? "active" : ""}
                  >
                    Find Papers
                  </div>
                  <div
                    // onClick={() => setActiveTab("upload")}
                    className={activeTab === "upload" ? "active" : ""}
                  >
                    Upload Papers
                  </div>
                </div>
              </div>
              <div className="row justify-content-between mt-3">

                {

                  activeTab === "drafts" ? (
                    <Drafts
                      setIsDraftCreated={setIsDraftCreated}
                      isDraftCreated={isDraftCreated}
                      classCode={classCode}
                      adminEmail={adminEmail}
                    />) :
                    activeTab === "collaborators" ? <Collaborators classCode={classCode} adminName={adminName} adminEmail={adminEmail} /> : null
                }
                {activeTab === "find" ? (
                  <FindPaper />) :
                  activeTab === "collaborators" ? <Collaborators classCode={classCode} adminName={adminName} adminEmail={adminEmail} /> : null}
                {activeTab === "upload" ? (
                  <UploadPaper />) :
                  activeTab === "collaborators" ? <Collaborators classCode={classCode} adminName={adminName} adminEmail={adminEmail} /> : null}
              </div>
            </div>
          </div>
          <div className="d-block d-md-none">
            <FooterNav />
          </div>
          <CreateDraft
            setIsDraftCreated={setIsDraftCreated}
            classCode={classCode}
            isModalOpen={show}
            toggleModal={toggle}
            setShow={setShow}
          />
        </div>
      ) : (
        <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <CircularProgress size={80} className="display-block" />
        </div>
      )}

    </>
  );
};

export default Workspace;