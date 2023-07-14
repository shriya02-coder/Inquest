import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import TextEditor from "./TextEditor";
import "./WritePaper.css";
import MobileHeader from "../../partials/Header/MobileHeader";
import Header from "../../partials/Header/Header";
import { Upload } from "@mui/icons-material";
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import axios from 'axios';

const WritePaper = () => {
  const history = useHistory();
  const classCode = useParams().id;
  const draftId = useParams().draftId;
  const [seeAll, setSeeAll] = useState(false);
  const [activeTab, setActiveTab] = useState(useParams().tab);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [show, setShow] = useState(false);
  const toggle = () => setShow(prevState => !prevState);
  const [loading, setLoading] = useState(false);
  const [isDraftCreated, setIsDraftCreated] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  useEffect(() => {
    if (!activeTab) setActiveTab("upload");
    if (activeTab === "upload") {
      history.replace('/workspace/' + classCode + '/drafts/' + draftId + '/upload');
    } else if (activeTab === "plagiarism") {
      history.replace('/workspace/' + classCode + '/drafts/' + draftId + '/plagiarism');
    } else if (activeTab === "paraphrase") {
      history.replace('/workspace/' + classCode + '/drafts/' + draftId + '/paraphrase');
    } else if (activeTab === "ask") {
      history.replace('/workspace/' + classCode + '/drafts/' + draftId + '/ask');
    }
  }, [activeTab])

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const paraphrasingToolRapidAPIKey="e8ad57b8c4msh5d19f730f3f5ec8p1f2cfdjsnddf79a72ff91"

  const [values, setValues] = useState({
    paraphrase: "",
});

const [answer,setAnswer] =useState('')
   
  const handleNewChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit=async(event)=> {
     event.preventDefault();
     console.log(values.paraphrase);

    const response = await axios({
        method: 'post',
        url: 'https://paraphrasing-tool1.p.rapidapi.com/api/rewrite',
        headers: {
            "x-rapidapi-host": "paraphrasing-tool1.p.rapidapi.com",
            "x-rapidapi-key": paraphrasingToolRapidAPIKey,
            "content-type": "application/json",
            "accept": "application/json",
            "useQueryString": true
        },
        data: { "sourceText": values.paraphrase }
    })

    console.log(response.data.newText)
    setAnswer(response.data.newText)
}

  const [pdfFile, setPdfFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);


  const fileType = ['application/pdf'];
  const handleChange = (e) => {
    let selectedFile = e.target.files[0];
    // console.log(selectedFile.type);
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
          setPdfFile(e.target.result);
        }
      }
      else {
        setPdfFile(e.target.result)
      }
    }
    else {
      setPdfFile(null);
    }
  }

  const handleSubmitUpload = (e) => {
    e.preventDefault()
    if (pdfFile != null) {
      setViewPdf(pdfFile)
    }
    else {
      setViewPdf(null)
    }
  }

  return (
    <div className="WritePaper">
      <div className="d-none d-md-block">
        <Header />
      </div>
      <div className="d-block d-md-none">
        <MobileHeader />
      </div>
      <div className="row d-flex flex-row">
        <div className="WritePaper_Body col-12 col-md-10 col-lg-9 col-xl-12 d-flex mt-4 px-2 px-sm-4">
          <div className="WritePaper_Nav col-5 col-md-3 col-lg-5 col-xl-5 p-2 content-box mt-4 py-2 px-4 py-sm-3 px-sm-4">
            <div className="col-12 col-md-10 col-lg-9 col-xl-12">
              <div className="d-flex justify-content-between WritePaper_Navtab mt-4">
                <div
                  onClick={() => setActiveTab("upload")}
                  className={activeTab === "upload" ? "active" : ""}
                >
                  <b>Upload</b>
                </div>
                <div
                  onClick={() => setActiveTab("plagiarism")}
                  className={activeTab === "plagiarism" ? "active" : ""}
                >
                  <b>Plagiarism</b>
                </div>
                <div
                  onClick={() => setActiveTab("paraphrase")}
                  className={activeTab === "paraphrase" ? "active" : ""}
                >
                  <b>Paraphrase</b>
                </div>
                <div
                  onClick={() => setActiveTab("ask")}
                  className={activeTab === "ask" ? "active" : ""}
                >
                  <b>Ask ChatGPT</b>
                </div>

              </div>
            </div>
          </div>
          {

            activeTab === "upload" ? (
              <>
                <div className="WritePaper_Navbody d-flex justify-content-center leftbar">
                  <form onSubmit={handleSubmitUpload}>
                    <input type="file" className="form-control" onChange={handleChange} />
                    <button type="submit" className="btn btn-success submitBtn ">Submit</button>
                  </form>
                  <div className="Pdf col-12 col-md-10 col-lg-9 col-xl-12 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                      {viewPdf && <>
                        <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} className="pdfViewAdd" />
                      </>
                      }
                      {!viewPdf && <>No pdf</>}
                    </Worker>
                  </div>
                </div>
              </>) : null}
          {

            activeTab === "plagiarism" ? (
              <>
              <div className="WritePaper_Navbody d-flex justify-content-center leftbar">
                <textarea name="textarea" rows="5" cols="50"  maxlength="70">
                  Plagiarism your text.
                  </textarea>
                  <button type="submit" className="btn btn-success ">Submit</button>
                  <hr />
                  <textarea name="textarea" rows="5" cols="50" minlength="50" maxlength="70">
                  </textarea>
                </div>
               
              </>) : null}

          {

            activeTab === "paraphrase" ? (
              <>
                <div className="WritePaper_Navbody d-flex justify-content-center leftbar">
                  <form onSubmit={handleSubmit}>
                <textarea type="texrarea" name="paraphrase" rows="5" cols="50" minlength="50" maxlength="70" onChange={handleNewChange("paraphrase")}  value={values.paraphrase}/>
    
                  <button type="submit" className="btn btn-success ">Submit</button>
                  <hr />
                  <textarea name="textarea" rows="5" cols="50" minlength="50" maxlength="70">
                  Your Paraphrased text.
                  </textarea>
                  </form>
                </div>
              </>) : null}

          {

            activeTab === "ask" ? (
              <>
                <div className="WritePaper_Navbody d-flex justify-content-center leftbar">
                  <form onSubmit={handleSubmitUpload}>
                  <input class="form-control" placeholder="What are we finding today?" type="text" name="keyword" required/>
                    <button type="submit" className="btn btn-success submitBtn ">Submit</button>
                  </form>
                  <hr />
                    <textarea name="textarea" rows="5" cols="50" minlength="50" maxlength="70">
                  </textarea>
                </div>
              </>) : null}

        </div>
        <div className="WritePaper_info col-7 col-md-5 col-lg-7 col-xl-7 p-2 justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
          <div className="Editor col-12 col-md-10 col-lg-9 col-xl-12">
            <TextEditor />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritePaper;