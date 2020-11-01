import React,{useState, useEffect} from 'react';
import './Comment.css';
import ShowComments from './ShowComments';
import { useHistory } from "react-router-dom";

const Comment = ({userid,postid,username,updateComment,commentList,comment_uname, count}) =>{
	const [comment,setComment] = useState('');
	const [err,setError] = useState('');
	const [showComment, setShowComments] = useState(true);
	const [showView,setShowView] = useState(false);
	const history = useHistory();

	useEffect(() => {
		if(count > 3){
			setShowView(true);
			setShowComments(false);
		}
	})
	
	const viewComments = () =>{
		history.push({
			pathname:'/box/comments',
			state:{
				commentList:commentList,
				userid:userid,
				postid:postid, 
				username: username,
				comment_uname
			}
		})
	}

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
					setError('try again');
				}
			})
		}	
	}

	return (
		<div>
			{(showView) && <button onClick={viewComments} className="view-btn">{`view all ${count} comments`}</button>}
			{
				(showComment) && <ShowComments  userid={userid}
							   postid={postid}
							   username={username}
							   updateComment={updateComment}
							   commentList={commentList}
							   comment_uname={comment_uname}/>
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