import React, { useState, useCallback } from "react";
import { Menu } from 'primereact/menu';
import {Item} from '../StyledComponents/styledComponents';
import Header from '../Header/Header';
import "./Sidebar.css";

const Sidebar = (props) => {

  const [isExpanded, setisExpanded] = useState(false);

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    setisExpanded(!isExpanded);
  }, [isExpanded, setisExpanded])
  
  //item of sidebare  
  let items = [
    { label: 'Home', icon: 'pi pi-home', command: () => { window.location.hash = '/'; }},
    { label: 'Countries', icon: 'pi pi-globe', command: () => { window.location.hash = '/countries'; } },
    { label: 'Servers', icon: 'pi pi-calendar-plus', command: () => { window.location.hash = '/servers'; } },
    { label: 'Users', icon: 'pi pi-users', command: () => { window.location.hash = '/users'; } },
    { label: 'Logs', icon: 'pi pi-upload', command: () => { window.location.hash = '/logs'; } },
    { label: 'Devices', icon: 'pi pi-desktop', command: () => { window.location.hash = '/devices'; } },
    { label: 'Sessions', icon: 'pi pi-clock', command: () => { window.location.hash = '/sessions'; } },
    { label: 'Operating Systems', icon: 'pi pi-th-large', command: () => { window.location.hash = '/operatingsystems'; } },
    { label: 'Notifications', icon: 'pi pi-bell', command: () => { window.location.hash = '/notifications'; } },
    { label: 'Feedbacks', icon: 'pi pi-envelope', command: () => { window.location.hash = '/feedbacks'; } },
    { label: 'Settings', icon: 'pi pi-cog', command: () => { window.location.hash = '/settings'; } },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => { window.location.hash = `/logout`; } }
  ];

  
  //sidebare
  let sidebar = <Item className="SS">
    <div className={`${!isExpanded ? "sidebar" : "sidebartoggle"}`}>
      <Menu model={items}	className="menu" />
    </div>
  </Item>

  
  //header with sidebar
  return <div className="Container">
    <Header isExpanded={isExpanded} handleToggle={handleToggle}/>
    <div className='flexable-box'>
      {sidebar}
      <div className='items'>{props.items}</div>
    </div>
  </div>
}
export default Sidebar;
