// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import GroupVerse from './GroupVerse';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ContactForm from './ContactForm';
import Pagination from '@mui/material/Pagination';


const IslamicSearch = () => {
  // Declare state variables
  const [showAlert, setShowAlert] = useState(true);
  const [userQuery, setUserQuery] = useState('');
  const [resultList, setResultList] = useState([]);
  const [metadataList, setMetadataList] = useState([]); // Store metadata separately
  const [loading, setLoading] = useState(false);
  const [tafsir_ibn_kathir, set_tafsir_ibn_kathir] =useState([])
  const [groupVerses, setGroupVerses] = useState([])
  const [arabicText, setArabicText] = useState([]);
  const [maarif_ul_quran, set_maarif_ul_quran] = useState([]);
  const [arabicSpeechURLs, setArabicSpeechURLs] = useState([[]]);
  const [currentSpeechGroup, setCurrentSpeechGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState();



  const handleSpeaking = (groupID, actionType, text="") => {
    if (currentSpeechGroup == "" || currentSpeechGroup != groupID){
        setCurrentSpeechGroup(groupID)
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        utterance.onend = function(event) {
          setCurrentSpeechGroup("")
        }
        return
    }
    if (actionType == "pause"){
      const synth = window.speechSynthesis;
      synth.pause();
    }
    else if(actionType == "resume"){
      if (currentSpeechGroup == ""){
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        utterance.onend = function(event) {
          setCurrentSpeechGroup("")
        }
        return
      }
      const synth = window.speechSynthesis;
      synth.resume();
    }
  }


  
  // Function to handle search request
  const search = async (page_num, search_bar=false) => {

    if (userQuery.length == 0) return
    
    setShowAlert(false);
    setResultList([]);
    setMetadataList([]);
    set_tafsir_ibn_kathir([])
    setArabicText([])
    setLoading(true);
    setCurrentPage(page_num)

    console.log("page number:", page_num)
    let tempData = ""
    if (search_bar){
      const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/Quran", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_query: userQuery }),
    });
    const data = await response.json();
    setAllData(data)
    tempData = {"documents" : [data["documents"][0].slice((page_num-1)*10, (page_num)*10)], "metadatas": [data["metadatas"][0].slice((page_num-1)*10, (page_num)*10)]}
    }
    else{
      tempData = {"documents" : [allData["documents"][0].slice((page_num-1)*10, (page_num)*10)], "metadatas": [allData["metadatas"][0].slice((page_num-1)*10, (page_num)*10)]}
    }
    
    

    if (tempData && Array.isArray(tempData["documents"]) && Array.isArray(tempData["metadatas"])) {
      setResultList(tempData["documents"][0]);
      setMetadataList(tempData["metadatas"][0]);
    }

    // Function to fetch Tafsir by Ibn Kathir and the list of verses in one verseKey group
    const fetchTafsir = async (verseKey) => {
        const response = await fetch(`https://api.qurancdn.com/api/qdc/tafsirs/en-tafisr-ibn-kathir/by_ayah/${verseKey}`);
        const data = await response.json();
        return {
          text: data['tafsir']['text'],
          verses: Object.keys(data['tafsir']['verses']),
        };
      };

    // Function to fetch all groups Tafsir by Ibn Kathir data
    const fetchAllTafsirs = async () => {
    const startVerseKeys = tempData["metadatas"][0].map(singleGroup => singleGroup['verse_key']);
    const tafsirs = await Promise.all(startVerseKeys.map(fetchTafsir));
    
    const tafsirTexts = tafsirs.map(tafsir => tafsir.text);
    const currentGroupVerses = tafsirs.map(tafsir => tafsir.verses);
    set_tafsir_ibn_kathir(tafsirTexts);
    setGroupVerses(currentGroupVerses);
    };
    fetchAllTafsirs();    
    
    if (window.gtag) {
      console.log("custom event")
      window.gtag('event', 'query_enter', {
        'query': 'hikmah tes'
      });
    }
    
  };

  // Function to fetch Arahic Text, Maarid-ul-Quran, and url of one verse
  const fetchTextAndTafsir = async (key) => {
    const arabicPromise = fetch(`https://api.quran.com/api/v4/quran/verses/usmani?verse_key=${key}`)
      .then(response => response.json())
      .then(data => data["verses"][0]["text_uthmani"] + '[' + data["verses"][0]["verse_key"].split(':')[1] + ']');
  
    const tafsirPromise = fetch(`https://api.qurancdn.com/api/qdc/tafsirs/en-tafsir-maarif-ul-quran/by_ayah/${key}`)
      .then(response => response.json())
      .then(data => data['tafsir']['text']);

    const arabicSpeechPromise = fetch(`https://api.quran.com/api/v4/recitations/4/by_ayah/${key}`)
      .then(response => response.json())
      .then(data => "https://verses.quran.com/" + data['audio_files'][0]['url'])
  
    return Promise.all([arabicPromise, tafsirPromise, arabicSpeechPromise]);
  };
  
  // Function to fetch Arahic Text, Maarid-ul-Quran, and url of all groups of verses
  const fetchAllTexts = async () => {
    const allGroups = await Promise.all(
      groupVerses.map(async (group) => {
        const allDataInGroup = await Promise.all(group.map(fetchTextAndTafsir));
  
        let combinedArabicText = "";
        let combinedTafsirText = "";
        let speechURLs = []
        const uniqueTafsirTexts = new Set();
  
        allDataInGroup.forEach(data => {
          const [arabicText, tafsirText, arabicUrl] = data;
          combinedArabicText += arabicText + ' ';

          speechURLs.push(arabicUrl)
  
          if (!uniqueTafsirTexts.has(tafsirText)) {
            uniqueTafsirTexts.add(tafsirText);
            combinedTafsirText += tafsirText + ' ';
          }
        });
        return {
          arabicText: combinedArabicText.trim(),
          tafsirText: combinedTafsirText.trim(),
          speechURLs: speechURLs
        };
      })
    );
  
    setArabicText(allGroups.map(group => group.arabicText));
    set_maarif_ul_quran(allGroups.map(group => group.tafsirText));
    setArabicSpeechURLs(allGroups.map(group => group.speechURLs))
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTexts();
  }, [groupVerses]);
  





  return (
    <div >
      <h1>Al-Hikmah Search</h1>
      
<Box display="flex"
  justifyContent="center"
  alignItems="center"
  padding={3}>
  <Paper
      onSubmit={(e) => e.preventDefault()}
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width:'80%' }}
    >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="What is my mission"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          inputProps={{ maxLength: 100 }}
        />
       
        <LoadingButton
        type='Submit'
          style={{paddingRight: "17px"}}
          size="small"
          onClick={() =>{search(1, true)}}
          endIcon={<SearchIcon />}
          loading={loading}
          loadingPosition="center"
          variant="contained"
        >
      </LoadingButton>
    </Paper>
</Box>


<Box display="flex" justifyContent="flex-end" alignItems="center" padding={1}>
      <Button variant="contained" color="success" data-toggle="modal" data-target="#feedbackModal">
        Feedback
      </Button>
</Box>

<div className="modal fade" id="feedbackModal" tabIndex="-1" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="feedbackModalLabel">Feedback</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <ContactForm />
      </div>
    </div>
  </div>
</div>


{showAlert && 
<div>
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={1}>
    <div style={{ marginBottom: '10px' }}>
      <Alert severity='info' style={{maxWidth: "500px"}}>
        🌟<b>Discover Quranic Wisdom Through AI</b>🌟<br />
        Enter your query in the search bar to explore relevant verses from the Holy Quran. Our advanced AI technology connects you with the teachings of the Quran like never before. Start your journey of knowledge and inspiration today.
      </Alert>
    </div>
    
    <div style={{ marginTop: '10px' }}>
      <Alert severity="warning" style={{maxWidth: "500px"}}>
        <b>Important Note</b><br />
        Please be aware that the results returned may not always be the perfect match from the Quran or directly relevant to your query. For more in-depth understanding, consider referring to the Tafsir of the verses.
      </Alert>
    </div>
  </Box>
</div>
}
      {
        arabicText.map((text, index) => (
          <div key={index}>
            <GroupVerse nowPlaying={currentSpeechGroup} handleEnglishSpeech={(groupID, actionType, text) => handleSpeaking(groupID, actionType, text)} arabicSpeech={arabicSpeechURLs[index]} startVerse={groupVerses[index][0]} arabicText={text} englishTranslation={resultList[index]} tafsir_ibn_kathir={tafsir_ibn_kathir[index]} maarif_ul_quran={maarif_ul_quran[index]}></GroupVerse>
            <Divider />
          </div>
        ))
      }      
      {!loading && !showAlert && 
      <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
        <Pagination page={currentPage} count={10} color="primary" onChange={(event, value) => {search(value)}}/>
        </Box>
      }
    </div>
  );
};

export default IslamicSearch;
