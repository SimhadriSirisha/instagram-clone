import React,{useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import './SingleComment.css';
import {useLocation} from 'react-router-dom';

const SingleComment = ({commentData, updateComment, userid, replyto}) =>{
	const [reply,setReply]=useState('');
	const [openReply, setOpenReply] = useState(false);
	const [showCommentAvatar, setShowCommentAvatar] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if(location.pathname === '/box/comments'){
			setShowCommentAvatar(true);		
		}
	})

	const open_reply = () =>{
		setOpenReply(!openReply);
	}

	const onSubmit = (e) =>{
		e.preventDefault();
		fetch('http://localhost:3001/comment',{
				method:'put',
        		headers:{'Content-Type':'application/json'},
        		body: JSON.stringify({
        			postid: commentData.postid,
        			parent_id : commentData.id,
        			comment : reply,
 					userid
        		})
			})
			.then(res => res.json())
			.then(comments => {
				if(comments.id){
					setReply('');
					updateComment(comments);
					setOpenReply(!openReply);
				}
				else{
					console.log('try again');
				}
			})
	}

	return (
		<div>
			<div className="comment-blk">
				{
					(showCommentAvatar) &&  <div style = {{paddingLeft:"0.5rem"}}>
												<Avatar src='#'
														alt = {commentData.username}/>
											</div>
				}
				<div className="right-comment-blk">
					<div className="upper">
						<h4>{commentData.username}</h4>
						{
							(replyto !== undefined)?<p className="comment-Data"><span style={{color:"violet"}}>{replyto}</span> {commentData.comment} </p>:<p className="comment-Data"> {commentData.comment} </p>
						}
					</div> 
					{(showCommentAvatar) &&  <button className="post-btn" onClick={open_reply}> reply </button>}
				</div>
			</div>
			<div className="new-comment-section">
				{
					openReply && (
							<form className="nc-form" onSubmit={onSubmit}>
								<input placeholder = "add a comment" 
									   type="text" 
									   className="comment-ip" 
									   value={reply}
									   style={{width:"60%"}}
									   onChange = {e => setReply(e.target.value)}/>
								<input className="post-btn" type="submit" value="reply"/>
							</form>
						) 
				}
			</div>
		</div>
	)
}

export default SingleComment;