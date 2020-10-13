import React, {useState, useEffect} from 'react';
import './Edit_Profile.css';
import { useHistory } from "react-router-dom";

const Edit_Profile = ({user,loadEditedUser}) =>{
	const history = useHistory();
	const imgTag = [<img className='edit_blk_profile_pic' alt='insta-name' src={require('../images/pic8.png')}/>];
	const [name, setName] = useState(user.name);
	const [bio, setBio] = useState(user.bio);
	const [pn, setPn] = useState(user.mobile);
	const [email, setEmail] = useState(user.email);
	const [username, setUsername] =  useState(user.username);
	const [error,setError] = useState('');

	const errorDisplay = (err,p) =>{
	    if(err === ''){
	      p.classList.remove('active');
	    }
	    else{
	      p.classList.add('active');
	    }
	  }

	  useEffect(()=>{
	    const p = document.getElementById('error');
	    errorDisplay(error,p);
	  },[error]);

	const editReq = (e) =>{
		e.preventDefault();
		setError('');
		fetch('http://localhost:3001/editProfile',{
			method:'post',
        	headers:{'Content-Type':'application/json'},
        	body: JSON.stringify({
			  id: user.user_id,
	          name,
	          bio,
	          pn,
	          email,
	          username
	        })
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if(data.id){
				loadEditedUser(data);
				history.goBack();
			}
			else{
				setError('error');
			}
		})
	}

	return( 
		<div className="edit_container">
			<div className="intro_blk">
				<div className = 'edit_top_block'>
					{imgTag[0]}
				</div>
				<h3 className="username ugridcss"> {user.username} </h3>
			</div>
			<form className="edit-form" onSubmit={editReq}>
	           	<div className="ip_cont">
	           		<label for="ip_name">Name</label>
		            <input className="ip_css"
		            	   id = "ip_name"
		                   placeholder=" Name" 
		                   value = {user.name}
		                   type="text"
		                   onChange = {e => setName(e.target.value)}/>
		        </div>
		        <div className="ip_cont">
	           		<label for="ip_name">Username</label>
	           		<input className="ip_css"
	           			   id="ip_username" 
                   		   placeholder=" Username"
                   		   value = {user.username} 
                   		   type="text"
                   		   onChange = {e => setUsername(e.target.value)}/>
		        </div>
		        <div className="ip_cont">
	           		<label for="ip_bio">Bio</label>
		            <input className="ip_css"
		            	   id = "ip_bio"
		                   placeholder=" Bio" 
		                   value = {user.bio}
		                   type="text"
		                   onChange = {e => setBio(e.target.value)}/>
		        </div>
		        <div className="ip_cont">
	           		<label for="ip_email">Email</label>
		            <input className="ip_css"
		            	   id = "ip_email"
		                   placeholder=" Email" 
		                   value = {user.email}
		                   type="text"
		                   onChange = {e => setEmail(e.target.value)}/>
		        </div>
		        <div className="ip_cont">
	           		<label for="ip_pn">Phone Number</label>
		            <input className="ip_css"
		            	   id = "ip_pn"
		                   placeholder=" Phone Number" 
		                   value = {user.mobile}
		                   type="text"
		                   onChange = {e => setPn(e.target.value)}/>
		        </div>
            	<input className="input-btn"
                	   value="submit" 
                	   type="submit"/>
               	<p className="red" id="error"> unable to update </p>
          </form>
		</div>
	)
} 

export default Edit_Profile;