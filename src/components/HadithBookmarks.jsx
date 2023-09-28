import React, { useState, useEffect } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';

function HadithBookmarks(props) {
    const [hadithBookmarks, setHadithBookmarks] = useState([]);

    const generateReferenceLink = (reference) => {
        const [_, source, id] = reference.split(' ');
        let urlBase = '';
        if (source === 'Muslim') {
            urlBase = 'https://sunnah.com/muslim:';
          
        } 
        else{
            urlBase = 'https://sunnah.com/bukhari:';
        }
        return `${urlBase}${id}`;
      };

    // const handleDeleteHadith = (user_query, hadithID) => {
    // fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/delete_hadith_bookmark', {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': props.token, // Replace with your token
    //     },
    //     body: JSON.stringify({
    //     user_query: user_query,
    //     hadithID: hadithID,
    //     }),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Hadith deleted successfully:', data);
    //     // You may want to refresh the list or perform other UI updates here
    // })
    // .catch(error => {
    //     console.error('Error deleting hadith:', error);
    // });
    // };
      
    const handleDeleteHadith = (user_query, hadithID) => {
        fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/delete_hadith_bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': props.token,
          },
          body: JSON.stringify({
            user_query: user_query,
            hadithID: hadithID,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Hadith deleted successfully:', data);
          
          // Update the local state to reflect the deletion
          const updatedBookmarks = hadithBookmarks.map(bookmark => {
            if (bookmark.user_query === user_query) {
              return {
                ...bookmark,
                hadithIDs: bookmark.hadithIDs.filter(id => id !== hadithID)
              };
            }
            return bookmark;
          });
          setHadithBookmarks(updatedBookmarks);
        })
        .catch(error => {
          console.error('Error deleting hadith:', error);
        });
      };

      useEffect(() => {
        setHadithBookmarks(props.hadithBookmark);
      }, [props.hadithBookmark]);
      
      
  return (
    <div>
      {hadithBookmarks.map((bookmark, index) => (
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
            <Stack style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} spacing={1}>
              {bookmark.hadithIDs.map((hadithID, hadithIndex) => (
                <div key={hadithIndex} style={{ display: 'flex', alignItems: 'center' }}>
                <Link 
                  underline="none" 
                  target="_blank" 
                  href={generateReferenceLink(hadithID)} 
                  color="inherit" 
                  style={{ marginBottom: 8 }}
                >
                  <Chip label={hadithID} color="success" />
                </Link>
                <ClearIcon 
                  style={{ cursor: 'pointer'}}
                  onClick={() => handleDeleteHadith(bookmark.user_query, hadithID)} 
                />
              </div>
              ))}
              </Stack>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default HadithBookmarks