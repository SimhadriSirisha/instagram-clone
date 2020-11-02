import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import './Post.css';
import {useLocation} from 'react-router-dom';
import Comment from '../Comment/Comment';
import { useHistory } from "react-router-dom";

const Post = ({username,imageUrl,caption,likes,id,likedPosts,loadLikes,userid,comment_uname,goHome,deleteFailed,loadNoOfPosts}) =>{
	const [l,setLikes] = useState(likes);
	const [liked, setLiked] = useState(false);
	const location = useLocation();
	const [commentList, setCommentList] = useState([]);
	const [count, setCount] = useState(0);
	const history = useHistory();

	useEffect(() => {
		const delBtn = document.querySelector('.right-post-header');
		delBtn.classList.remove('show-right-post-header');
		if(location.pathname === '/box/showPost'){
			delBtn.classList.add('show-right-post-header');
		}

		if(likedPosts && likedPosts.includes(id)){
			setLiked(true);
		}

		fetch(`http://localhost:3001/allComment/${id}`)
	    .then((res)=>res.json())
	    .then((data)=>{
	      setCommentList(data);
	      setCount(data.length);
	    });
	})

	const delPost = () => {
		fetch('http://localhost:3001/delete',{
			method:'delete',
        	headers:{'Content-Type':'application/json'},
	        body: JSON.stringify({
	        	postid:id,
	        	userid:userid
	        })
		})
		.then((res)=>res.json())
		.then((n)=>{
			if(n>=0){
				loadNoOfPosts(n);
				goHome();
			}
			else{
				deleteFailed();
			}
		})
	}

	const viewComments2 = () =>{
		history.push({
			pathname:'/box/comments',
			state:{
				commentList:commentList,
				userid:userid,
				postid:id, 
				username: username,
				comment_uname
			}
		})
	}

	const updateLikes = () =>{
		fetch('http://localhost:3001/likes',{
        	method:'put',
        	headers:{'Content-Type':'application/json'},
        	body:JSON.stringify({
        		userid,
        		postid:id
        	})
        })
        .then(res => res.json())
        .then(likes => {
        	if(likes.err){
        		console.log('unable to like');
        	}
        	else{
        		loadLikes({likes,id});
        		setLikes(likes);
        		setLiked(true);
        	}
        })
	} 

	const updateLikesUnlikes = () =>{
		if(liked){
			fetch('http://localhost:3001/unlike',{
				method:'put',
        		headers:{'Content-Type':'application/json'},
        		body:JSON.stringify({
        			postid:id
        		})
			})
			.then(res => res.json())
			.then(likes => {
				if(likes.err){
        			console.log('unable to unlike');
        		}
        		else{
        			loadLikes({likes,id});
        			setLikes(likes);
        			setLiked(false);
        		}
			})
		}
		else{
			console.log('liking');
			updateLikes();
		}
	}

	const updateComment = (newComment) => {
		setCommentList(commentList.concat(newComment));
		setCount(count+1);
	}

	return(
		<div className="post-container">
			<div className="post-header">
				<div className="left-post-header">
					<Avatar src='#'
							alt = {username}  
							size={100}
							/>
					<h4>{username}</h4>
				</div>
				<div className="right-post-header">
					<button className="del-button" onClick={delPost}> delete post </button>
				</div>
			</div>
			<div onDoubleClick={updateLikes}>
				<img className="post-img" alt='xgf' src={imageUrl}/>
			</div>
			<div className='post-footer'>
				<div className="post_icons_set">
					<button className="post_icon_btn" style={{marginRight:'10px'}}>
						{
							(liked)?<FavoriteIcon color='secondary' onClick={updateLikesUnlikes}/> 
										:
									<FavoriteBorderSharpIcon onClick={updateLikesUnlikes}/>
						}
					</button>
					<button className="post_icon_btn" onClick={viewComments2}>
						<ModeCommentOutlinedIcon />
					</button>
				</div>
				{(l!==0) && <p>{`${l} likes`}</p>}
				<p><strong>{username}</strong>{ caption}</p>
			</div>
			<Comment username={username}
					 postid = {id}
					 userid = {userid}
					 updateComment = {updateComment}
					 commentList = {commentList}
					 comment_uname = {comment_uname}
					 count = {count}/>
		</div>
	)
}

export default Post;