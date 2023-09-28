import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from './CustomDrawer';
import ContactForm from './ContactForm';
import { Link } from "react-router-dom";


function Navbar(props) {
    const handleSignOut = ()=>{
        localStorage.removeItem('AHS_Token')
        props.updateToken(null)
    }

    return (
        <Box sx={{ flexGrow: 1}}>
          <AppBar position="static" style={{background: '#4169E1'}}>
            <Toolbar>
            <CustomDrawer handleSelectRecitation={props.handleSelectRecitation} handleSelectTranslation={props.handleSelectTranslation} translationSelected={props.translationSelected} recitationSelected={props.recitationSelected}/>
            <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
            <Button color="inherit" data-toggle="modal" data-target="#feedbackModal">Feedback</Button>
            {props.token? 
            <>
                <Link to="/bookmarks" style={{ textDecoration: 'none', color: 'white'}}>
                    <Button color="inherit">
                    Bookmarks
                    </Button>
                </Link>
                <Button color="inherit" onClick={handleSignOut}>SIGNOUT</Button>
            </>: 
            <>
            <Button color="inherit" disabled>
                Bookmarks
            </Button>
            <Link to="/signin" style={{ textDecoration: 'none', color: 'white'}}>
                <Button color="inherit">SIGNIN</Button>
            </Link>
            </>
            }            
          </Toolbar>
          </AppBar>
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
        </Box>
      );
}

export default Navbar