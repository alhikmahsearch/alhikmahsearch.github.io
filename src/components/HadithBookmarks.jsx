import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function HadithBookmarks(props) {
    // const [hadithBookmark, setHadithBookmark] = useState([])
    // const [loading, setLoading] = useState(true)

    // fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/get_hadith_bookmarks', {
    // method: 'GET',
    // headers: {
    //     'Authorization': props.token
    // }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     setHadithBookmark(data['Hadith'])
    //     setLoading(false)
    // })
    // .catch(error => console.error('Error:', error));


  return (
    <div>
        hadithBookmarks
        {/* {loading&&<Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <CircularProgress />
        </Box>} */}
      {props.hadithBookmark.map((bookmark, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}a-content`}
            id={`panel${index + 1}a-header`}
          >
            <Typography>{bookmark.user_query}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {bookmark.hadithIDs.map((hadithID, hadithIndex) => (
                <div key={hadithIndex}>{hadithID}</div>
              ))}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default HadithBookmarks