import React from 'react';
import Logo from '../../assets/images/i2vpn_logo.png';
import {Dots} from "../StyledComponents/styledComponents";
import './Header.css';
// import User from "../../assets/images/user.png"
const Header =(prop)=>{

        return(
            <div className="Head">
                <Dots>
                    <div className={`${!prop.isExpanded ? "dots" : "toggle"}`} onClick={prop.handleToggle}>
                    <div className='Line1'></div>
                    <div className='Line2'></div>
                    <div className='Line3'></div>
                    </div>
                </Dots>
            
                <div className="logo">
                    <img src={Logo} alt="i2tv_logo" width='105px' />
                </div>
                
                <div className="Avatar">
                    <h3>
                        <i className="pi pi-user p-mr-2" style={{'fontSize': '1em'}}></i>
                        {/* <img src={User}alt="user" style={{maxWidth:"40px"}} /> */}
                        <span>{localStorage.getItem('email')}</span>
                    </h3>
                </div>

            </div>
        );
 } 
 export default Header;