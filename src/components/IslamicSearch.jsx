// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import '../IslamicSearch.css'; // assuming you have a CSS file with the same styles
import CustomDrawer from './CustomDrawer';
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ContactForm from './ContactForm';
import Pagination from '@mui/material/Pagination';
import QuranResults from './QuranResults';
import HadithResults from './HadithResults';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import masjid from '../images/mosque.avif'
import kabaa from '../images/kabaa.jpeg'
import Navbar from './Navbar';



const IslamicSearch = (props) => {
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
  const [currentPageQuran, setCurrentPageQuran] = useState(1);
  const [currentPageHadith, setCurrentPageHadith] = useState(1);
  const [allData, setAllData] = useState();
  const [translationID, setTranslationID] = useState(localStorage.getItem('ahs_translationID') || "131")
  const [recitationId, setRecitationID] = useState(localStorage.getItem('ahs_recitationID') || "1")
  const [selectQuranHadith, setSelectQuranHadith] = useState(0)
  const [allHadithData, setAllHadithData] = useState([])
  const [currentPageHadithData, setCurrentPageHadithData] = useState([])

  const  removeFooters = (s) => {
    return s.replace(/<sup[^>]*>.*?<\/sup>/g, '');
  }


  const handleQuranSelect = ()=>{
    // skip if already in Quran or no results yet shown
    if (selectQuranHadith == 0 || allHadithData.length == 0) {
      setSelectQuranHadith(0)
      return
    }
    setSelectQuranHadith(0)
    search(currentPageQuran, false, 0)
  }
  
  const handleHadithSelect = ()=>{
    // skip if already in hadith or no results yet shown
    if (selectQuranHadith == 1 || resultList.length == 0) {
      setSelectQuranHadith(1)
      return
    }
    setSelectQuranHadith(1)
    search(currentPageHadith, false, 1)
  }
 
  const handleSelectTranslation = (event)=>{
    localStorage.setItem('ahs_translationID', event.target.value);
    setTranslationID(event.target.value)
    fetchAllTexts(event.target.value, true, undefined)
  }

  const handleSelectRecitation = (event) => {
    localStorage.setItem('ahs_recitationID', event.target.value);
    setRecitationID(event.target.value)
    fetchAllTexts(undefined, false, event.target.value)
  }
  
  // Function to handle search request
  const search = async (page_num, search_bar=false, search_type=undefined) => {
    if (search_type==undefined) search_type = selectQuranHadith 
    if (userQuery.length == 0) return
    // go to empty states when search entered
    if (search_bar){
      setShowAlert(false);
      setResultList([]);
      setMetadataList([]);
      set_tafsir_ibn_kathir([])
      setArabicText([])
      setLoading(true);      

      setAllHadithData([])
    }

    if (search_type == 0){
      setCurrentPageQuran(page_num)
      let tempData = ""
      if (search_bar || resultList.length==0){
        setCurrentPageQuran(1)
        setLoading(true)
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
      if (window.gtag) {
        console.log("custom event")
        window.gtag('event', 'Quran_query', {
          'query': 'hikmah tes'
        });
      }  
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
    }
    else{
      setCurrentPageHadith(page_num)
      if (search_bar || allHadithData.length==0){
        setLoading(true)
        setCurrentPageHadith(1)
        const response = await fetch("https://islamicsearch-4dbe9a36a60c.herokuapp.com/Hadith", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_query: userQuery }),
      });
      const data = await response.json();
      setAllHadithData(data)
      setCurrentPageHadithData(data.slice((page_num-1)*10, (page_num)*10))
      if (window.gtag) {
        console.log("custom event")
        window.gtag('event', 'Hadith_query', {
          'query': 'hikmah tes'
        });
      }
      }
      else{
        setCurrentPageHadithData(allHadithData.slice((page_num-1)*10, (page_num)*10))
      }
      setLoading(false);
    }
  };

// Function to fetch Arabic Text, Maarid-ul-Quran, and URL of one verse
const fetchTextAndTafsir = async (key, recitatation) => {
  const arabicPromise = fetch(`https://api.quran.com/api/v4/quran/verses/usmani?verse_key=${key}`)
    .then(response => response.json())
    .then(data => data["verses"][0]["text_uthmani"] + '[' + data["verses"][0]["verse_key"].split(':')[1] + ']');

  const tafsirPromise = fetch(`https://api.qurancdn.com/api/qdc/tafsirs/en-tafsir-maarif-ul-quran/by_ayah/${key}`)
    .then(response => response.json())
    .then(data => data['tafsir']['text']);

  const arabicSpeechPromise = fetch(`https://api.quran.com/api/v4/recitations/${recitatation}/by_ayah/${key}`)
    .then(response => response.json())
    .then(data => "https://verses.quran.com/" + data['audio_files'][0]['url'])

  return Promise.all([arabicPromise, tafsirPromise, arabicSpeechPromise]);
};

// Function to fetch Arabic Text, Maarid-ul-Quran, and URL of translation text
const fetchTranslationText = async (key, languageID, modified) => {
  if (languageID != 131 || modified== true) {
    const translationPromise = fetch(`https://api.quran.com/api/v4/quran/translations/${languageID}?verse_key=${key}`)
      .then(response => response.json())
      .then(data => removeFooters(data['translations'][0]['text']));

    return translationPromise;
  } else {
    return null; // If languageID is 131, return null as we don't need to fetch translation.
  }
  
};

// Function to fetch Arabic Text, Maarid-ul-Quran, Tafsir, and translation text if needed
const fetchAllTexts = async (changeLanguage=undefined, modified=false, changeRecitation=undefined) => {
  if (changeLanguage == undefined){
    changeLanguage = translationID
  }
  if (changeRecitation == undefined){
    changeRecitation = recitationId
  }
  const allGroups = await Promise.all(
    groupVerses.map(async (group) => {
      const allDataInGroup = await Promise.all(group.map(async (verseKey) => {
        const [arabicText, tafsirText, arabicUrl] = await fetchTextAndTafsir(verseKey ,changeRecitation);
        const translationText = await fetchTranslationText(verseKey, changeLanguage, modified);

        return {
          arabicText,
          tafsirText,
          translationText,
          arabicUrl
        };
      }));

      let combinedArabicText = "";
      let combinedTafsirText = "";
      let combinedTranslationText = "";
      let speechURLs = []
      const uniqueTafsirTexts = new Set();

      allDataInGroup.forEach(data => {
        const { arabicText, tafsirText, translationText, arabicUrl } = data;
        combinedArabicText += arabicText + ' ';
        speechURLs.push(arabicUrl);

        if (translationText) {
          combinedTranslationText += translationText + ' ';
        }

        if (!uniqueTafsirTexts.has(tafsirText)) {
          uniqueTafsirTexts.add(tafsirText);
          combinedTafsirText += tafsirText + ' ';
        }
      });

      return {
        arabicText: combinedArabicText.trim(),
        tafsirText: combinedTafsirText.trim(),
        translationText: combinedTranslationText.trim(),
        speechURLs: speechURLs
      };
    })
  );

  setArabicText(allGroups.map(group => group.arabicText));
  set_maarif_ul_quran(allGroups.map(group => group.tafsirText));
  try{
    if (allGroups[0]["translationText"] != "") setResultList(allGroups.map(group => group.translationText))
  }
catch{
}
  setArabicSpeechURLs(allGroups.map(group => group.speechURLs))
  setLoading(false);
};

  useEffect(() => {
    fetchAllTexts();
  }, [groupVerses]);
  





  return (
    <div >
      <Navbar updateToken={props.updateToken} token={props.token} handleSelectRecitation={handleSelectRecitation} handleSelectTranslation={handleSelectTranslation} translationSelected={translationID} recitationSelected={recitationId}/>
      <Box paddingTop={7}>
      <h1>Al-Hikmah Search</h1>
      </Box>

         
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
          placeholder="What is the purpose of life"
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

<Box display="flex" justifyContent="center" alignItems="center">
    <Stack direction="row" spacing={1}>
      <Chip 
      sx={{ fontSize: "18px"}} 
      avatar={<Avatar src={kabaa} style={{width: "29px", height: "29px"}}></Avatar>} 
      label="Quran" 
      variant={selectQuranHadith==0? "default": "outlined"}
      onClick={handleQuranSelect}/>
      <Chip
        sx={{ fontSize: "18px"}}
        avatar={<Avatar src={masjid} style={{width: "29px", height: "29px"}}/>}
        label="Hadith"
        variant={selectQuranHadith==1? "default": "outlined"}
        onClick={handleHadithSelect}
      />
    </Stack>

</Box>


{showAlert && 
<div>
  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" padding={1}>
    <div style={{ marginBottom: '10px' }}>
      <Alert severity='info' style={{maxWidth: "500px"}}>
      🌟<b>Discover Quran and Hadith with AI</b>🌟<br />
Enter your query in the search bar to discover relevant verses from the Holy Quran and Hadith. Our advanced AI technology connects you with the teachings of the Quran and Hadith for a comprehensive understanding. Start your journey of knowledge and inspiration today.      </Alert>
    </div>
    
    <div style={{ marginTop: '10px' }}>
      <Alert severity="warning" style={{maxWidth: "500px"}}>
        <b>Important Note</b><br />
        Please be aware that the results returned may not always be the perfect match from the Quran or Hadith or directly relevant to your query. For a more in-depth understanding, consider referring to the Tafsir of the verses and Hadith collections.      </Alert>
    </div>
  </Box>
</div>
}
      {selectQuranHadith==0?
      <QuranResults userQuery={userQuery} token={props.token} arabicText={arabicText} arabicSpeechURLs={arabicSpeechURLs} groupVerses={groupVerses} resultList={resultList} tafsir_ibn_kathir={tafsir_ibn_kathir} maarif_ul_quran={maarif_ul_quran}/>
        : !loading && <HadithResults currentPageHadithData={currentPageHadithData} token={props.token} userQuery={userQuery}/>
      }
      {!loading && !showAlert && 
      <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
        { selectQuranHadith==0?
          <Pagination page={currentPageQuran} count={10} color="primary" onChange={(event, value) => {search(value)}}/>
        : <Pagination page={currentPageHadith} count={10} color="primary" onChange={(event, value) => {search(value)}}/>
        }
        </Box>
      }   
    </div>
  );
};

export default IslamicSearch;
