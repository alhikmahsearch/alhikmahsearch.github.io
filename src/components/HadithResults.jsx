import React, {useState, useEffect} from 'react'
import SingleHadith from './SingleHadith'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';


function HadithResults(props) {
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
        {props.currentPageHadithData.map((item, index) => (
          <div key={index}>
            <SingleHadith hadith={item}/>
          </div>))
          
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

export default HadithResults