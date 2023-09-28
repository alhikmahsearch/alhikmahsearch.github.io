import React, {useEffect, useState} from 'react'
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import masjid from '../images/mosque.avif'
import kabaa from '../images/kabaa.jpeg'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import QuranBookmarks from './QuranBookmarks';
import HadithBookmarks from './HadithBookmarks';


function Bookmarks(props) {
    const [selectQuranHadith, setSelectQuranHadith] = useState(0);
    const [hadithBookmark, setHadithBookmark] = useState([])
    const [quranBookmark, setQuranBookmark] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    const handleQuranSelect = (force=false)=>{
        // skip if already in Quran
        if ((selectQuranHadith == 0 && force==false) || quranBookmark.length>0) {
          setSelectQuranHadith(0)
          return
        }
        console.log("handle quran")
        setLoading(true)
        setSelectQuranHadith(0)
        fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/get_quran_bookmarks', {
        method: 'GET',
        headers: {
            'Authorization': props.token
        }
        })
        .then(response => response.json())
        .then(data => {
            setQuranBookmark(data['Quran'])
            setLoading(false)
            console.log("quran data loaded")
        })
        .catch(error => console.error('Error:', error));
    }
      
      const handleHadithSelect = ()=>{
        // skip if already in hadith
        if (selectQuranHadith == 1 || hadithBookmark.length>0) {
          setSelectQuranHadith(1)
          return
        }
        console.log("handle Hadith")
        setLoading(true)
        setSelectQuranHadith(1)
        fetch('https://islamicsearch-4dbe9a36a60c.herokuapp.com/get_hadith_bookmarks', {
        method: 'GET',
        headers: {
            'Authorization': props.token
        }
        })
        .then(response => response.json())
        .then(data => {
            setHadithBookmark(data['Hadith'])
            setLoading(false)
            console.log("Hadith data loaded")
        })
        .catch(error => console.error('Error:', error));
      }
      
      const goHome = () => {
        navigate('/');
        };
    
        useEffect(() =>{
            handleQuranSelect(true)
        }, [])
          
  return (
    <div>
        
        <Box sx={{ position: 'absolute', left: 15, top: 15}}>
            <Button 
            onClick={goHome}
            sx={{ 
                mb: 2, 
                fontSize: '1.1rem'
            }}
            >
            <KeyboardReturnIcon />Home
            </Button>
        </Box>
        <h3 style={{paddingTop: "50px"}}>Bookmarks</h3>
        <Box display="flex" justifyContent="center" alignItems="center" padding={3}>
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
        {loading&&<Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <CircularProgress />
        </Box>}
        {selectQuranHadith == 0? <QuranBookmarks token={props.token} quranBookmark={quranBookmark}/>
        : <HadithBookmarks token={props.token} hadithBookmark={hadithBookmark}/>}
    </div>
  )
}

export default Bookmarks