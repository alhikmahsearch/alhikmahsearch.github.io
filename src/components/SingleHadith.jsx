import React, {useState} from 'react'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import MuiAlert from '@mui/material/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SingleHadith({hadith, token, userQuery}) {
  const [bookmarkstate, setBookmarkstate] = useState(false)

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
                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Tooltip>
                    <IconButton>
                      <BookmarkIcon onClick={addBookmark}/>
                    </IconButton>
                  </Tooltip>
                  <small className="text-muted" style={{marginTop: 7}}>Reference: <a href={referenceLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit'}}>{hadith["Id"]}</a></small>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default SingleHadith