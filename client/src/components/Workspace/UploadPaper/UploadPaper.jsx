import React, { useState } from "react";
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import SelectInput from "@material-ui/core/Select/SelectInput";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import './UploadPaper.css';
import FeatureAccordion from "./FeatureAccordion.js"

const UploadPaper = () => {

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
    <>
      <div className="Upload_paper row m-0 justify-content-center">
        <div className="Upload_Info col-7 col-md-10 col-lg-9 col-xl-7 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
          <form onSubmit={handleSubmitUpload}>
            <input type="file" className="form-control" onChange={handleChange} />
            <button type="submit" className="btn btn-success submitBtn ">Submit</button>
          </form>
        </div>

          <div className="viewerPdf col-7 col-md-10 col-lg-9 col-xl-7 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
              {viewPdf && <>
                <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} className="pdfViewAdd" />
              </>
              }
              {!viewPdf && <>No pdf</>}
            </Worker>
          </div>
        </div>
        <div className=" accordion-container  col-5 col-md-10 col-lg-9 col-xl-5 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
          <FeatureAccordion />
        </div>
    </>
  )
}
export default UploadPaper;