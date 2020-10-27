import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import './Post.css';
import {useLocation} from 'react-router-dom';
import Comment from '../Comment/Comment';

const Post = ({username,imageUrl,caption,likes,id,loadLikes,userid}) =>{
	const [l,setLikes] = useState(likes);
	const [liked, setLiked] = useState(0);
	const location = useLocation();
	const [comment_details,setCommentDetails] = useState([]);
	const [err,setError] = useState('');

	useEffect(() => {
		const delBtn = document.querySelector('.right-post-header');
		delBtn.classList.remove('show-right-post-header');
		if(location.pathname === '/box/showPost'){
			delBtn.classList.add('show-right-post-header');
		}
		// fetch(`http://localhost:3001/allComment/${id}`)
  //   	.then((res)=>res.json())
  //   	.then(data => {
  //   		console.log(`data:${id}`,data);
  //   		setCommentDetails(data);
  //   	})
	})

	const delPost = () => {
		
	}

	const updateLikes = () =>{
		console.log("doubleClicked")
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
        		setLiked(1);
        	}
        })
	} 

	const updateLikesUnlikes = () =>{
		if(liked){
			console.log('un-liking');
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
        			setLiked(0);
        		}
			})
		}
		else{
			console.log('liking');
			updateLikes();
		}
	}

	const uploadComment = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		const comment = data.get('comment')
		console.log("input comment",comment);

		if(comment === ''){
			setError('Empty');
		}
		else{
			fetch('http://localhost:3001/comment',{
				method:'put',
        		headers:{'Content-Type':'application/json'},
        		body: JSON.stringify({
        			postid:id,
        			userid,
        			comment
        		})
			})
			.then(res => res.json())
			.then(comments => {
				if(comments.id){
					comments = {...comments,username:username};
					const postComments = comment_details;
					postComments.push(comments);
					console.log(postComments);
					setCommentDetails(postComments);
				}
				else{
					console.log('try again');
					setError('try again');
				}
			})
		}	
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
					<button className="post_icon_btn">
						<ModeCommentOutlinedIcon />
					</button>
				</div>
				{(l!==0) && <p>{`${l} likes`}</p>}
				<p><strong>{username}</strong>{ caption}</p>
				<div>
				{
					(comment_details.length !== 0) && (comment_details.map(cmntObj =>{
						console.log('cmnt',cmntObj);
						return (
							<Comment key = {cmntObj.id}
									 id = {cmntObj.id}
								     parent_id = {cmntObj.parent_id}
									 cmnt = {cmntObj.comment}
									 postid = {cmntObj.postid}
						 			 username={cmntObj.username}/>
						);
					}))

				}
				</div>
			</div>
			<div className="new-comment-section">
				<form className="nc-form" onSubmit={uploadComment}>
					<input placeholder ="add a comment" type="text" className="comment-ip" name="comment"/>
					<input className="post-btn" type="submit" value="post"/>
				</form>
			</div>
			{(err !== '') && <p style={{color:"red"}}> {`${err} !!!`} </p>}
		</div>
	)
}

export default Post;