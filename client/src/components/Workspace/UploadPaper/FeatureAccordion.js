import React,{useState} from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Button from '@mui/material/Button';
import { Configuration, OpenAIApi } from "openai";
import './FeatureAccordion.css';

export default function FeatureAccordian() {

  const [text, setText] = useState("");
      const [summarizedtext, setsummarizedtext] = useState("");
      const [loading, setLoading] = useState(false);

      const configuration = new Configuration({
        // apiKey: process.env.OPENAI_API_KEY,
        apiKey:"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",
      });
      const openai = new OpenAIApi(configuration);

      const HandleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        openai
          .createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(text),
            temperature: 0.6,
            max_tokens: 100,
          })
          .then((res) => {
            if (res.status === 200) {
              setLoading(false);
              setsummarizedtext(res?.data?.choices[0]?.text);
            }
          })
          .catch((err) => {
            console.log(err, "An error occured");
          });
      };

      function generatePrompt(text) {
        return `Summarize this ${text}. and break them into seperate lines`;
      }

  return (
    <div style={{}}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography
            style={{
              fontWeight: 10,
            }}
          >
            Generate Summary
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography> 
             <form onSubmit={HandleSubmit}>
            <textarea type="textarea" name="textarea" rows="5" cols="50" minlength="50" maxlength="500" onChange={(e) => setText(e.target.value)} value={text}/>
                  <button type="submit" className="btn btn-success ">Submit</button>
                  </form>
                  <hr />
                  <textarea name="textarea" rows="5" cols="50" minlength="50" maxlength="70" value={summarizedtext}
                onChange={(e) => setText(e.target.value)}/>
                  </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ width: 490 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography
            style={{
              fontWeight: 10,
            }}
          >
            Annotate Paper
            
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography> <Button sx={{backgroundColor:"#fff"}} classname="btnn-2" variant="contained"><a href="/annotate">Annotate</a></Button></Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ width: 490 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <Typography
            style={{
              fontWeight: 10,
            }}
          >
            Generate Citation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <label>
            Enter your URL: <input name="myInput" />
             
            </label>
            
            <button type="submit" className="btn btn-success submitBtns ">Submit</button>
            <hr />
            <label>
        Pick a Citation Format:
        <select name="selectedFruit">
          <option value="APA">APA</option>
          <option value="Harvard">Harvard</option>
          <option value="Chicago">Chicago</option>
        </select>
      </label>
      <hr />
            <label>
              <textarea name="postContent" rows={4} cols={40} />
            </label>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
