import React, { useState, useEffect } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from '@mui/material/Link';
import '../groupVerse.css';

function GroupVerse(props) {
    const [selectedTafsir, setSelectedTafsir] = useState('tafsir-ibn-kathir');
    const [isPlaying, setIsPlaying] = useState(false);
    const [arabicSpeechComplete, setArabicSpeechComplete] = useState(false)
    const [currentAudio, setCurrentAudio] = useState(null);
    const [arabicSpeechStart, setArabicSpeechStart] = useState(false);
  

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
        } else {
          setArabicSpeechComplete(true)
          resumeEnglish()
        }
      };
    
      playNextAudio();
    };

    const handlePause = ()=>{
      setIsPlaying(false)
      if (!arabicSpeechComplete){
        currentAudio.pause()
        return
      }
      props.handleEnglishSpeech(props.startVerse, "pause", "")
    }

    const resumeEnglish = ()=>{
      props.handleEnglishSpeech(props.startVerse, "resume", props.englishTranslation)
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
      resumeEnglish()
    }

    const shareOnWhatsApp = () => {
      const shareText = `Starting Verse: ${props.startVerse}\n\u202B${props.arabicText}\u202C\n${props.englishTranslation}`;
      const encodedShareText = encodeURIComponent(shareText);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedShareText}`;
      window.open(whatsappUrl, '_blank');
    };

    useEffect(()=>{
      if (props.nowPlaying != props.startVerse){
        setIsPlaying(false)
        setArabicSpeechStart(false)
        setArabicSpeechComplete(false)
        if (currentAudio){
          currentAudio.pause()
        }
      }    
    }, [props.nowPlaying])

    return (
        <div className="group-verse-container" style={{marginLeft: "1%", marginRight: "1%"}}>
            <div className="left-side">
              <p>{props.startVerse}</p>
              {isPlaying ? <Tooltip title="Pause">
              <IconButton><PauseIcon onClick={handlePause}/></IconButton>
              </Tooltip> :
              <Tooltip title="Play">
                <IconButton><PlayArrowIcon onClick={handleResume}/></IconButton>
              </Tooltip>}
              <Tooltip title="Tafsir">
              <IconButton variant="text" style={{marginTop: 8}}><MenuBookIcon data-toggle="modal" data-target={`#${modalId}`} /></IconButton>
              </Tooltip>
              <Tooltip title="Share">
              <IconButton onClick={shareOnWhatsApp} style={{marginTop: 8}}>
                <WhatsAppIcon />
              </IconButton>
              </Tooltip>
              <Tooltip title="See in Surah">
                <Link href={`https://quran.com/${(props.startVerse.split(":"))[0]}?startingVerse=${(props.startVerse.split(":"))[1]}`} color="inherit" style={{marginTop: 10, marginLeft: 8}}><ArrowForwardIcon color='action'/></Link>
              </Tooltip>
            </div>
            
            <div className="right-side">
              <p dir="rtl">{props.arabicText}</p>
              <p>{props.englishTranslation}</p>
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