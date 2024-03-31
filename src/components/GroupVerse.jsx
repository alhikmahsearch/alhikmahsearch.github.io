import React, { useState, useEffect } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import '../groupVerse.css';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import tick_icon from '../images/tick_icon.svg'
import cross_icon from '../images/cross-icon.svg'
import 'bootstrap/dist/css/bootstrap.min.css';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GroupVerse(props) {
    const [selectedTafsir, setSelectedTafsir] = useState('tafsir-ibn-kathir');
    const [isPlaying, setIsPlaying] = useState(false);
    const [arabicSpeechComplete, setArabicSpeechComplete] = useState(false)
    const [currentAudio, setCurrentAudio] = useState(null);
    const [arabicSpeechStart, setArabicSpeechStart] = useState(false);
    const [bookmarkstate, setBookmarkstate] = useState(false);
    const [showRelevancy, setShowRelevancy] = useState(true);

    const modalId = `bd-example-modal-lg-${props.startVerse}`; // create a unique id based on startVerse or some other unique prop
    
    const renderTafsirContent = () => {
      if (selectedTafsir === 'tafsir-ibn-kathir') {
        return props.tafsir_ibn_kathir;
      } else if (selectedTafsir === 'maarif-ul-quran') {
        return props.maarif_ul_quran;
      }
    };

    const handleArabicSpeaker = () => {
      setArabicSpeechStart(true)
      const audioUrls = props.arabicSpeech
    
      let currentAudioIndex = 0;
      let audio = new Audio(audioUrls[currentAudioIndex]);
    
      const playNextAudio = () => {
        audio = new Audio(audioUrls[currentAudioIndex]);
        audio.addEventListener('ended', handleAudioEnded);
        audio.play();
        setCurrentAudio(audio)
      };
    
      const handleAudioEnded = () => {
        currentAudioIndex++;
        if (currentAudioIndex < audioUrls.length) {
          playNextAudio();
        }
        else{
          setArabicSpeechStart(false)
          setIsPlaying(false)
        }
      };
    
      playNextAudio();
    };

    const handlePause = ()=>{
      setIsPlaying(false)
      currentAudio.pause()
    }

    const handleResume = ()=>{
      setIsPlaying(true)
      if (!arabicSpeechStart){
        handleArabicSpeaker()
        return
      }
      else if (!arabicSpeechComplete){
        currentAudio.play()
        return
      }
      // resumeEnglish()
    }

    const shareOnWhatsApp = () => {
      const shareText = `Starting Verse: ${props.startVerse}\n\u202B${props.arabicText}\u202C\n${props.englishTranslation}`;
      const encodedShareText = encodeURIComponent(shareText);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedShareText}`;
      window.open(whatsappUrl, '_blank');
    };

    const handleBookmarkClose = () => {
      setBookmarkstate(false)
    };
  
    const addBookmark = async() => {
      setBookmarkstate(true)

      try {
        const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/add_quran_bookmark", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${props.token}` // Use the Bearer schema for JWT tokens
          },
          body: JSON.stringify({ user_query: props.userQuery, verse:props.startVerse }) // Convert the body data to JSON string
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
          body: JSON.stringify({query: props.userQuery, document_result: props.englishTranslation, label: label, data_type: "Quran"})
        })
      }
      catch (error) {
        console.error('Error:', error);
      }
    }

    useEffect(()=>{
      setIsPlaying(false)
      setArabicSpeechStart(false)
      setArabicSpeechComplete(false)
      if (currentAudio){
        currentAudio.pause()
      }  
    }, [props.nowPlaying])

    return (
        <div className="group-verse-container" style={{marginLeft: "1%", marginRight: "1%"}}>
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
            <div className="left-side">
              <Link underline="none" target="_blank" href={`https://quran.com/${(props.startVerse.split(":"))[0]}?startingVerse=${(props.startVerse.split(":"))[1]}`} color="inherit" style={{marginBottom: 8}}>{props.startVerse}</Link>
              {isPlaying ? <Tooltip title="Pause">
              <IconButton><PauseIcon onClick={handlePause}/></IconButton>
              </Tooltip> :
              <Tooltip title="Play">
                <IconButton><PlayArrowIcon onClick={handleResume}/></IconButton>
              </Tooltip>}
              <Tooltip title="Tafsir">
              <IconButton variant="text" style={{marginTop: 8}}><MenuBookIcon data-toggle="modal" data-target={`#${modalId}`} /></IconButton>
              </Tooltip>
              {props.token && <Tooltip title="Bookmark">
              <IconButton style={{marginTop: 8}}>
                <BookmarkIcon onClick={addBookmark}/>
              </IconButton>
              </Tooltip>}
              <Tooltip title="Share">
              <IconButton onClick={shareOnWhatsApp} style={{marginTop: 8}}>
                <WhatsAppIcon />
              </IconButton>
              </Tooltip>
            </div>
            <div className="right-side">
              <p dir="rtl" style={{fontSize: 30}}>{props.arabicText}</p>
              <p>{props.englishTranslation}</p>
              {showRelevancy && <div className="icon-toggle-btn-group">
                <span style={{color: '#808080', marginRight: '10px'}}>Was this result relevant:</span>
                <Tooltip title="Mark as Relevant" arrow>
                  <Button variant="contained" color="success" className='me-2' onClick={() => handleResultRelevancy(1)}><img src={tick_icon} style={{width: '20px'}}/></Button>
                </Tooltip>
                <Tooltip title="Mark as Irrelevant" arrow>
                  <Button variant="contained" color="error" onClick={() => handleResultRelevancy(-1)}><img src={cross_icon} style={{width: '20px'}}/></Button>
                </Tooltip>
              </div>}
            </div>
            
            <div className="modal fade" id={modalId} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-lg">
                
                <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <div className="mx-auto"> 
                      <Stack direction="row" spacing={1}>
                          <Chip 
                              label="Tafsir Ibn Kathir" 
                              color={selectedTafsir === 'tafsir-ibn-kathir'? "success": "default"} 
                              onClick={() => setSelectedTafsir('tafsir-ibn-kathir')}
                          />
                          <Chip 
                              label="Maarif-Ul-Quran" 
                              color={selectedTafsir === 'maarif-ul-quran'? "success": "default"} 
                              onClick={() => setSelectedTafsir('maarif-ul-quran')}
                          />
                      </Stack>
                  </div>
                  <Tooltip title="Close">
                    <IconButton>
                    <CancelIcon data-dismiss="modal"/>
                    </IconButton>
                  </Tooltip>      
              </div>

                  <div className="modal-body" dangerouslySetInnerHTML={{ __html: renderTafsirContent() }}>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}

export default GroupVerse;