import React,{useState} from 'react';
import './Comment.css';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = ({userid,postid,username,updateComment,commentList}) =>{
	const [comment,setComment] = useState('');
	const [err,setError] = useState('');
	
	const uploadComment = (event) => {
		event.preventDefault();

		if(comment === ''){
			setError('Empty');
		}
		else{
			fetch('http://localhost:3001/comment',{
				method:'put',
        		headers:{'Content-Type':'application/json'},
        		body: JSON.stringify({
        			postid,
        			userid,
        			comment
        		})
			})
			.then(res => res.json())
			.then(comments => {
				if(comments.id){
					setComment('');
					updateComment(comments);
				}
				else{
					console.log('try again');
					setError('try again');
				}
			})
		}	
	}

	return (
		<div> 
			{commentList && commentList.map((commentData,idx) =>{
					if(commentData.parent_id === 0){
						return(
							<div>
							<SingleComment key={idx}
										   commentData={commentData}
										   username = {username}
										   updateComment = {updateComment}
										   userid = {userid}/>
							<ReplyComment key={idx}
										  prev_comment_id = {commentData.id}
										  username = {username}
										  updateComment = {updateComment}
										  userid = {userid}
										  commentList = {commentList}
										  replyto = {commentData.username}/>
							</div>
						)
					}
				})
			}
			<div className="new-comment-section">
				<form className="nc-form" onSubmit={uploadComment}>
					<input placeholder ="add a comment" 
						   type="text" 
						   className="comment-ip" 
						   value={comment}
						   onChange = {e => setComment(e.target.value)}/>
					<input className="post-btn" type="submit" value="post"/>
				</form>
			</div>
			{(err !== '') && <p style={{color:"red"}}> {`${err} !!!`} </p>}
		</div>
	)
}

export default Comment;