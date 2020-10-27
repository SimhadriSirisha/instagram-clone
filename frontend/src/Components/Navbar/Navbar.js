import React from 'react';
import './Navbar.css';
import { useHistory } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddBoxIcon from '@material-ui/icons/AddBox';

const Navbar = ({username,user_id}) =>{
	let history = useHistory();

	const upload = () =>{
		history.push({
            pathname:'/box'
        })
	}

	const logout = () =>{
		// localstorage.clear('token');
		history.push({
			pathname:'/signin'
		})
	}

	const profile = () =>{
		history.push({
			pathname:`/profile/${user_id}`
		})
	}

	const home = () =>{
		history.push({
			pathname:'/home'
		})
	}

	return(
		<div className = "nav-container">
			<div className = "nav-section">
				<div className='nav-img'>
					<img alt='insta-name' src={require('../images/logo_name.png')}/>
				</div>
				<div className="icons_block">
					<button className="icon_btn" onClick = {home}><HomeIcon fontSize="large" /></button>
					<button className="icon_btn" onClick = {upload}><AddBoxIcon fontSize="large" /></button>
					<button className="icon_btn icon_css" onClick = {profile}><AccountCircleIcon fontSize="large"/></button>
					<button className="icon_btn icon_css" style={{fontSize:"1.1rem", fontWeight:"bold"}} onClick = {logout}>Log Out</button>
				</div>
			</div>
		</div>
	)
}
export default Navbar;
