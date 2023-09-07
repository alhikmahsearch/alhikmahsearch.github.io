import React, { useState, useEffect } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import '../groupVerse.css';

function GroupVerse(props) {
    const [selectedTafsir, setSelectedTafsir] = useState('tafsir-ibn-kathir');
    const modalId = `bd-example-modal-lg-${props.startVerse}`; // create a unique id based on startVerse or some other unique prop


    const renderTafsirContent = () => {
      if (selectedTafsir === 'tafsir-ibn-kathir') {
        return props.tafsir_ibn_kathir;
      } else if (selectedTafsir === 'maarif-ul-quran') {
        return props.maarif_ul_quran;
      }
    };

    const handleTranslationSpeaker = () => {
      console.log("urls:", props.arabicSpeech)
      const audioUrls = props.arabicSpeech
    
      let currentAudioIndex = 0;
      let audio = new Audio(audioUrls[currentAudioIndex]);
    
      const playNextAudio = () => {
        audio = new Audio(audioUrls[currentAudioIndex]);
        audio.addEventListener('ended', handleAudioEnded);
        audio.play();
      };
    
      const handleAudioEnded = () => {
        currentAudioIndex++;
        if (currentAudioIndex < audioUrls.length) {
          playNextAudio();
        } else {
          // This is where we start the text-to-speech after all audio files have been played
          speak();
        }
      };
    
      const speak = (voices) => {
        console.log("speaking")
        const utterance = new SpeechSynthesisUtterance(props.englishTranslation);
        window.speechSynthesis.speak(utterance);
      }
    
      // Start by playing the first audio file
      playNextAudio();
      // speak()
    };


    return (
        <div className="group-verse-container" style={{marginLeft: "1%", marginRight: "1%"}}>
            <div className="left-side">
              <p>{props.startVerse}</p>
              <Tooltip title="Speak">
              <IconButton onClick={handleTranslationSpeaker}><VolumeUpIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Tafsir">
              <IconButton variant="text" style={{marginTop: 8}}><MenuBookIcon data-toggle="modal" data-target={`#${modalId}`} /></IconButton>
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
