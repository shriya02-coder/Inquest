import { Avatar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reduxSlices/authSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getDateFromTimestamp, getTimeFromTimestamp } from "../../utilities";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import { Button } from 'reactstrap';

const Collaborators = ({adminName, adminEmail, classCode}) => {
    const storeData = useSelector(selectUserData);
    const [collaborators, setCollaborators] = useState([]);
    const userData = useSelector(selectUserData);
    const [seeAll, setSeeAll] = useState(false);
    const [show, setShow] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reminderLoading, setReminderLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.post("http://localhost:5000/workspace/getCollaborators", {
            classCode: classCode
        },
        {
            headers: {
                Authorization: "Bearer " + userData.token
            }   
        })
        .then(res => {
            setCollaborators(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }, [])

    return (
        <div> 
        <div className="content-box py-3 px-4 pb-4 mb-5">
            <div className="Collaborators_Title mt-3">Admin</div>
            <hr className="m-0"></hr>
            <div className="d-flex mt-3">
                <div className="Avatar_Container Avatar_Small">
                    <Avatar> 
                        {adminName ? adminName[0] : null}
                    </Avatar>
                </div>
                <div className="d-flex flex-column justify-content-center Member_Name ms-3 fw-bold">
                    {adminName}
                </div>
            </div>
            <div className="Collaborators_Title mt-4">Members</div>
            <hr className="m-0"></hr>
            {
                loading ? <div className="d-flex justify-content-center mt-4 mb-2"><CircularProgress /></div> : collaborators.length !== 0 ? 
                    collaborators.map(member => {
                        return (
                            <div key={member._id} className="d-flex mt-3">
                                <div className="Avatar_Container Avatar_Small">
                                    <Avatar> 
                                        {member.name ? member.name[0] : null}
                                    </Avatar>
                                </div>
                                <div className="d-flex flex-column justify-content-center Member_Name ms-3 fw-bold">
                                    {member.name}
                                </div>
                            </div>
                        )
                    }) : <div className="mt-2">Currently there are no members in this classroom.</div>
            }
        </div>
        <div className="Reminders">
        <div className="content-box py-3 px-2 px-md-4 py-md-3 mb-3">
          <h6 className="ms-1">Reminders</h6>
          {
            reminders.slice(0, (seeAll ? reminders.length : 3)).map((reminder, index) => {
              let style = {};
              if (index !== reminders.length - 1 && !(!seeAll && index == 2)) {
                style.borderBottom = "1px solid #ccc";
              }
              return (
                <a key={reminder._id} href={"/classes/" + reminder.classCode + "/Draft/" + reminder._id}>
                  <div
                    className="d-flex flex-column Reminder px-2 py-2 py-md-3"
                    style={style}
                  >
                    <div className="Reminder_className">{reminder.className}</div>
                    <div className="Reminder_name">{reminder.name}</div>
                    <div className="Reminder_Desc">
                      {getTimeFromTimestamp(reminder.dueDate)} -{" "}
                      {getDateFromTimestamp(reminder.dueDate)}
                    </div>
                  </div>
                </a>
              );
            })
          }
          { 
            reminderLoading ? (
              <div className="d-flex justify-content-center mt-3">
                <CircularProgress size={30}/>
              </div>
            ) : 
            reminders.length > 3 ? (
              <div className="See_All d-flex justify-content-end">
                {
                  seeAll ? (
                    <div onClick={() => setSeeAll(false)}>
                      See Less
                    </div>
                  ) : (
                    <div onClick={() => setSeeAll(true)}>
                      See All
                    </div>
                  )
                }
              </div>
            ) : reminders.length == 0 ? (
                  <div className="ms-1 mt-2" style={{fontSize: "13px", color: "gray"}}>
                    No work due!
                  </div>
            ) : null
          }
        </div>

  
      </div>
      </div>
    )
}

export default Collaborators;