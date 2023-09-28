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
import DeleteIcon from '@mui/icons-material/Delete';


function QuranBookmarks(props) {
    const [quranBookmarks, setQuranBookmarks] = useState([]);

    const handleDeleteQuran = (user_query, verse) => {
        fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/delete_quran_bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': props.token,
          },
          body: JSON.stringify({
            user_query: user_query,
            verse: verse,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Quran deleted successfully:', data);
          
          // Update the local state to reflect the deletion
          const updatedBookmarks = quranBookmarks.map(bookmark => {
            if (bookmark.user_query === user_query) {
              return {
                ...bookmark,
                verses: bookmark.verses.filter(id => id !== verse)
              };
            }
            return bookmark;
          });
          setQuranBookmarks(updatedBookmarks);
        })
        .catch(error => {
          console.error('Error deleting Quran:', error);
        });
      };

      useEffect(() => {
        setQuranBookmarks(props.quranBookmark);
      }, [props.quranBookmark]);

  return (
    <div>
      {quranBookmarks.map((bookmark, index) => (
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
            <Stack style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >
              {bookmark.verses.map((verse, verseIndex) => (
                <div key={verseIndex} style={{ display: 'flex', alignItems: 'center', paddingRight: '10px'}}>
                <Link 
                  underline="none" 
                  target="_blank" 
                  href={`https://quran.com/${(verse.split(":"))[0]}?startingVerse=${(verse.split(":"))[1]}`} 
                  color="inherit" 
                  style={{ marginBottom: 8 }}
                >
                  <Chip label={verse} color="success" />
                </Link>
                <ClearIcon 
                  style={{ cursor: 'pointer', paddingBottom: '5px'}}
                  onClick={() => handleDeleteQuran(bookmark.user_query, verse)} 
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

export default QuranBookmarks