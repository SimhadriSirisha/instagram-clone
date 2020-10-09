import React from 'react';
import './Navbar.css';
import 'fontawesome-free-5.12.0-web/css/all.min.css';
import { useHistory } from "react-router-dom";

const Navbar = ({username}) =>{
	let history = useHistory();

	const upload = () =>{
		history.push({
            pathname:'/upload'
        })
	}

	const profile = () =>{
		history.push({
			pathname:'/profile'
		})
	}

	return(
		<div className = "nav-container">
			<div className='nav-img'>
				<img alt='insta-name' src={require('../images/logo_name.png')}/>
			</div>
			<div className="icons_block">
				<button className="new_post_btn" onClick = {upload}><i className="fa fa-plus-square icon_css" aria-hidden="true"></i></button>
				<div className = 'profile'>
					<button className="new_post_btn icon_css" onClick = {profile}><i class="fas fa-user-circle"></i></button>
					<h3>{username}</h3>
				</div>
			</div>
		</div>
	)
}
export default Navbar;
