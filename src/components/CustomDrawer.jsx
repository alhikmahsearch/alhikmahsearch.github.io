import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import IconButton from '@mui/material/IconButton';

export default function CustomDrawer(props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [translationSelect, setTranslationSelect] = useState(131)

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open)
  };


  const list = (anchor = "left") => (
    <Box
      sx={{ width : "100%", maxWidth: 400 }}
      role="presentation"
>
  <IconButton><MenuIcon fontSize='large' onClick={toggleDrawer(false)}/></IconButton>
      <List>
        <ListItem>
            
        <InputLabel htmlFor="grouped-native-select">Translation:</InputLabel>
        <Select native value={props.translationSelected} onChange={props.handleSelectTranslation} id="grouped-native-select" label="Grouping" style={{maxWidth: 200}}>
          <option aria-label="None" value="" />
          <optgroup label="English">
            <option selected value={"131"}>Dr. Mustafa Khattab</option>
            <option value={"84"}>Mufti Taqi Usmani</option>
            <option value={"20"}>Saheeh International</option>
            <option value={"95"}>Tafheem e Qur'an - Syed Abu Ali Maududi</option>
            <option value={"823"}>Maulana Whaiduddin Khan</option>
          </optgroup>
          <optgroup label="Urdu">
            <option value={"158"}>Bayan-ul-Quran - Dr. Israr Ahmad</option>
            <option value={"97"}>Tafheem e Qur'an - Syed Abu Ali Maududi</option>
            <option value={"819"}>Maulana Whaiduddin Khan</option>
          </optgroup>
        </Select>
        </ListItem>
        <ListItem>
        <InputLabel htmlFor="recitatoinSelector">Reciation:</InputLabel>
        <Select native value={props.recitationSelected} id="recitatoinSelector" onChange={props.handleSelectRecitation} style={{maxWidth: 200}}>
          <option value={"4"}>Abu Bakr al-Shatri</option>
          <option value={"3"}>Abdur-Rahman as-Sudais</option>
          <option value={"1"}>AbdulBaset AbdulSamad (Mujawwad)</option>
          <option value={"2"}>AbdulBaset AbdulSamad (Murattal)</option>
        </Select>
        </ListItem>
      </List>
    </Box>
  );

  return (
        <div>
          <IconButton style={{
          top: '0px',
          left: '0px',
          position: "fixed",
          overflow: "hidden",
          zIndex: 10
        }} onClick={toggleDrawer(true)}><MenuIcon fontSize='large'></MenuIcon></IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
          </div>
  );
}