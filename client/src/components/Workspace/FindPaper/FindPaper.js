import { useState, useEffect } from 'react';
import React from "react";
import './FindPaper.css';
import axios from 'axios';
import xml2js from 'xml2js';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { syncIndexes } from 'mongoose';
import Button from '@mui/material/Button';


const FindPaper = () => {
  const [values, setValues] = useState({
    keyword: "",
  });


  const [loading, setLoading] = useState(false);
  const [results, viewResult] = useState(
    [])
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values.keyword);
    axios.get(`http://export.arxiv.org/api/query?search_query=all:${values.keyword}&start=0&max_results=5`)
      .then(function (response) {
        // console.log(response.data); // this will print xml data structure
        let parser = new xml2js.Parser();
        parser.parseString(response.data, function (err, result) {
          console.log(result.feed.entry)
          console.log(result.feed.entry[0].title)
          viewResult(result.feed.entry)
        })

      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {

        console.log("json creation")

      });
  }



  return (
    <div className="row m-0 justify-content-center">
      <div className="Workspace_Info col-11 col-md-10 col-lg-9 col-xl-12 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4">
        <form action="/" method="post" class="d-flex" onSubmit={handleSubmit}>
          <div class="col-sm-10 pe-sm-0 mb-sm-0 mb-2">
            <div class="input-group">
              <input class="form-control" placeholder="What are we finding today?" type="text" name="keyword" onChange={handleChange("keyword")} value={values.keyword} required />
            </div>
          </div>
          <div class="col-sm-4 ps-sm-0">
            <button type="submit" class="btn bg-gradient-dark mb-0 ms-sm-3 me-auto h-100 w-100 d-block" value="Summarise">Search</button>
          </div>
        </form>
      </div>
      {
        results.length == 0 ? (
          <div>No drafts created</div>
        ) : (results.map((result, index) => {

          return (
            <div className='col-11 col-md-10 col-lg-9 col-xl-12 d-flex justify-content-between content-box mt-4 py-2 px-2 py-sm-3 px-sm-4'>
              <Accordion className='col-12' key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography
                    style={{
                      fontWeight: 'bold', fontSize: 20
                    }}
                  >
                    {result.title[0]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {result.summary[0]}
                  </Typography>
                </AccordionDetails>
                <Button sx={{backgroundColor:"#fff"}} classname="btnn-1" variant="contained"><a href={result.link[0].$.href}>View PDF</a></Button>
                <Button sx={{backgroundColor:"#fff"}} classname="btnn-2" variant="contained"><a href="/annotate">Annotate</a></Button>
                <BookmarkBorderIcon />

              </Accordion>
            </div>
          )
        }))
      }
    </div>
  )

}

export default FindPaper;

