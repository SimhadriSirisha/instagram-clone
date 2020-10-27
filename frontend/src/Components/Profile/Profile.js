import React, {useEffect, useState} from 'react';
import './Profile.css';
import { useHistory, useParams } from "react-router-dom";

const Profile = ({user}) =>{
	const {id} = useParams(); 
	const [userPosts,setPosts] = useState([]);
	const imgTag = [<img className='profile_pic' alt='insta-name' src={require('../images/pic8.png')}/>];
	const history = useHistory();

	useEffect(() => {
		console.log('id: ',id);
		fetch(`http://localhost:3001/profile/${id}`)
			.then(res => res.json())
			.then(data => {
				console.log('got by fetching',data);
				if(data !== 'unable to fetch'){
					setPosts(data)
				}
			});
	},[])

	const editProfile = () =>{
		history.push({
			pathname:'/edit_profile'
		});
	}

	const showPost = (post) => {
		history.push({
			pathname:'/box/showPost',
			state:{post:post}
		})
	}

	return(
		<div className='p_container'>
			<div className="top_block">
				<div className = 'dp_block'>
					{imgTag[0]}
				</div>
				<div className='p_info'>
					<div className="edit_block">
						<h3 className="username">{user.username}</h3>
						<button className="edit_btn" onClick = {editProfile}> Edit profile </button>
					</div>
					<div className="numbers">
						<p className="n_css"> <span style={{fontWeight: 'bold'}}>{user.no_of_posts}</span> posts </p>
						<p className="n_css"> <span style={{fontWeight: 'bold'}}>{user.followers}</span> followers </p>
						<p className="n_css"> <span style={{fontWeight: 'bold'}}>{user.following}</span> following </p>
					</div>
					<h4 className="name"> {user.name} </h4>
					<p style={{marginTop:'1rem'}}> {user.bio} </p>
				</div>
			</div>
			<hr/>
			<div className="posts_container">
				{
					(userPosts.length) ?
						(
							<div className="posts_container_inner">
								{
									userPosts.map((post,idx)=>{
										return(
											<div className="smallPost" key={post.id}>
												<img className='smallPost_pic' alt='post_img' src={post.imageurl} onClick={()=>showPost(post)}/>
											</div>
										)
									})
								}
							</div>
						)
						:
						(
							<h1> No posts Yet </h1>
						)
				}
			</div>
		</div>
	)	
}

export default Profile;