import React from 'react'
import GroupVerse from './GroupVerse'
import Divider from '@mui/material/Divider';

function QuranResults(props) {
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
    </div>
  )
}

export default QuranResults