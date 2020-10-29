import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import './SingleComment.css';

const SingleComment = ({commentData, username, updateComment, userid}) =>{
	const [reply,setReply]=useState('');
	const [openReply, setOpenReply] = useState(false);

	const open_reply = () =>{
		setOpenReply(!openReply);
	}

	const onSubmit = (e) =>{
		e.preventDefault();
		console.log("reply:", reply);
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
			{console.log(commentData)}

			<div className="comment-blk">
				<div style = {{paddingLeft:"0.5rem"}}>
					<Avatar src='#'
							alt = {username}/>
				</div>
				<div className="right-comment-blk">
					<div className="upper">
						<h4>{username}</h4>
						<p> {commentData.comment} </p>
					</div>
					<button className="post-btn" onClick={open_reply}> reply </button>
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