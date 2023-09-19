import React from 'react'
import SingleHadith from './SingleHadith'
import Divider from '@mui/material/Divider';


function HadithResults(props) {
  return (
    <div>
        {props.currentPageHadithData.map((item, index) => (
          <div key={index}>
            <SingleHadith hadith={item}/>
          </div>))
          
        }
    </div>
  )
}

export default HadithResults