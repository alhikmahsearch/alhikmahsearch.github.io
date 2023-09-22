import React, {useState, useEffect} from 'react'
import GroupVerse from './GroupVerse'
import Divider from '@mui/material/Divider';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';


function QuranResults(props) {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 200) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <div>
        {
        props.arabicText.map((text, index) => (
          <div key={index}>
            <GroupVerse arabicSpeech={props.arabicSpeechURLs[index]} startVerse={props.groupVerses[index][0]} arabicText={text} englishTranslation={props.resultList[index]} tafsir_ibn_kathir={props.tafsir_ibn_kathir[index]} maarif_ul_quran={props.maarif_ul_quran[index]}></GroupVerse>
            <Divider />
          </div>
        ))
      }  
      {showScrollTopButton && (
      <button
        type="button"
        className="btn position-fixed bottom-0 end-0 m-3"
        style={{ zIndex: 999 }}
        onClick={scrollToTop}
      >
        <KeyboardDoubleArrowUpIcon fontSize='large'></KeyboardDoubleArrowUpIcon>
      </button>
    )} 
    </div>
  )
}

export default QuranResults