import React, { useState, useEffect, useRef } from "react";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import clsx from "clsx";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, ModalBody } from "reactstrap";
import { selectUserData} from '../../../reduxSlices/authSlice';
import { useSelector } from 'react-redux';
import "./CreateDraft.css";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "10px",
    "& .MuiInputLabel-formControl ": {
      top: "-6px",
      fontSize: "18px",
      color: "gray",
      // fontWeight: 'bold'
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: "14px",
    },
    "& .MuiFormLabel-filled": {
      backgroundColor: "transaprent !important",
    },
    "& .MuiInputBase-root": {
      paddingBottom: "5px",
    },
    "& .MuiSelect-root": {
      paddingBottom: "0px",
      fontSize: "16px",
    },
    "& > .MuiButtonBase-root": {
      width: "90%",
      marginTop: "20px !important",
    },
  },
  margin: {
    margin: 0,
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
  },
}));

const CreateDraft = (props) => {
  // let TextArea = useRef(null);
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userData = useSelector(selectUserData);
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
};
  const handleSubmit = (e) =>{
    e.preventDefault();
    setLoading(true);
    axios.post("http://localhost:5000/workspace/createDraft", {
      name: values.name,
      classCode: props.classCode,
      creatorEmail:userData.userEmail
  },{ headers: { Authorization: 'Bearer ' + userData.token } }
  )
  .then((res)=>{
      console.log(res);
      console.log("Created");
      props.setShow(false);
      window.location.reload(false);
      setLoading(false);
  })
  .catch(err => {
      setError(err.response.data.message);
      setLoading(false);
  });


  }

  return (
    <>
      <Modal
        className="assignment_modal"
        isOpen={props.isModalOpen}
        toggle={props.toggleModal}
      >
        <ModalBody>
          <div style={{ backgroundColor: "white" }}>
            <div className="container">
              <div className="row justify-content-sm-center">
                <div className="col-12 pb-0">
                  <h1
                    style={{ color: "rgb(90,90,90)" }}
                    className="text-center pt-3 mb-4 fs-2"
                  >
                    Create Draft
                  </h1>
                  <form onSubmit={handleSubmit}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                    >
                      <InputLabel htmlFor="name"></InputLabel>
                      <Input
                        placeholder="Name"
                        fullWidth
                        id="name"
                        type="text"
                        margin="normal"
                        onChange={handleChange("name")}
                        required
                        value={values.name}
                        startAdornment={
                          <InputAdornment position="start">
                            <PermIdentityIcon />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {
                      loading ? (
                        <div className="d-flex justify-content-center mt-4">
                          <CircularProgress />
                        </div>
                      ) : null
                    }
                    {(
                      <button
                        type="submit"
                        style={{ display: "flex", justifyContent: "center" }}
                        className="m-auto mt-5 form-btn"
                      >
                        Create
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateDraft;
