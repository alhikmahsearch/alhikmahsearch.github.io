import React, {useState} from 'react'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import tick_icon from '../images/tick_icon.svg'
import cross_icon from '../images/cross-icon.svg'
import 'bootstrap/dist/css/bootstrap.min.css';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SingleHadith({hadith, token, userQuery}) {
  const [bookmarkstate, setBookmarkstate] = useState(false)
  const [showRelevancy, setShowRelevancy] = useState(true);
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
    
      const referenceLink = generateReferenceLink(hadith["Id"]);
      
      
      function cleanText(text) {
        // Remove (ﷺ) from the text
        let cleanedText = text.replace(/\(ﷺ\)/g, "");
        
        // Remove empty lines and spaces
        // Splitting the string into lines, trimming each line, filtering out empty lines,
        // and then joining back into a single string with spaces.
        cleanedText = cleanedText.split('\n')
                                 .map(line => line.trim())
                                 .filter(line => line)
                                 .join(' ');
        
        return cleanedText;
    }

      const handleBookmarkClose = () => {
        setBookmarkstate(false)
      };
      

      const addBookmark = async() => {
        setBookmarkstate(true)

        try {
          const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/add_hadith_bookmark", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}` // Use the Bearer schema for JWT tokens
            },
            body: JSON.stringify({ user_query: userQuery, hadithID:hadith["Id"] }) // Convert the body data to JSON string
          });
      
          if (response.status !== 200) {
            console.log("error message:", response.message)
          }
      
          const data = await response.json();
          console.log('Success:', data);
        } catch (error) {
          console.error('Error:', error);
        }
      }


      const handleResultRelevancy = async (label)=> {
        setShowRelevancy(false)
        try {
          const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/store_query_document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({query: userQuery, document_result: cleanText(hadith["English Chapter Name"]+". "+hadith["English Hadith"]), label: label})
          })
        }
        catch (error) {
          console.error('Error:', error);
        }
      }
    
    return (
        <div className="container my-4">
          <Snackbar
            autoHideDuration={2000}
            open={bookmarkstate}
            onClose={handleBookmarkClose}
            TransitionComponent={Fade}
          >
        <Alert onClose={handleBookmarkClose} severity="success" sx={{ width: '100%' }}>
          Bookmark Added!
        </Alert>
        </Snackbar>
          <div className="row">
            <div className="col-12">
              <div className="card" style={{backgroundColor: '#f3f3f3'}}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 text-left">
                      <h5 className="card-title">{hadith["English Book Name"]}</h5>
                    </div>
                    <div className="col-6 text-right">
                      <h5 className="card-title" style={{ fontSize: '1.5em' }}>{hadith["Arabic Book Name"]}</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-left">
                      <h6 className="card-subtitle mb-2 text-muted">{hadith["English Chapter Name"]}</h6>
                    </div>
                    <div className="col-6 text-right">
                      <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: '1.2em' }}>{hadith["Arabic Chapter Name"]}</h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-left">
                      <p className="card-text">{hadith["English Hadith"]}</p>
                    </div>
                    <div className="col-6 text-right">
                      <p className="card-text" style={{ fontSize: '1.2em' }}>{hadith["Arabic Hadith"]}</p>
                    </div>
                  </div>
                </div>
                {showRelevancy && <div className="icon-toggle-btn-group" style={{marginBottom: '5px'}}>
                      <span style={{color: '#808080', marginRight: '10px'}}>Was this result relevant:</span>
                      <Tooltip title="Mark as Relevant" arrow>
                        <Button variant="contained" color="success" className='me-2' onClick={() => handleResultRelevancy(1)}><img src={tick_icon} style={{width: '20px'}}/></Button>
                      </Tooltip>
                      <Tooltip title="Mark as Irrelevant" arrow>
                        <Button variant="contained" color="error" onClick={() => handleResultRelevancy(-1)}><img src={cross_icon} style={{width: '20px'}}/></Button>
                      </Tooltip>
                    </div>}
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <small className="text-muted" style={{marginTop: 7}}>Reference: <a href={referenceLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit'}}>{hadith["Id"]}</a></small>
                  {token && <Tooltip>
                    <IconButton>
                      <BookmarkIcon onClick={addBookmark}/>
                    </IconButton>
                  </Tooltip>}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default SingleHadith