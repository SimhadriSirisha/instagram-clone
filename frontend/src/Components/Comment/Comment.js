import React from 'react';
import './Comment.css';

const Comment = ({id,parent_id,cmnt,postid,username}) =>{
	if(cmnt){
		console.log("comment there");
		return(
			<div className="comment-block">
				<h4 className="cmt-username"> {username} </h4>
				<div className="parent-comment-blk">
					<p className="cmmnt"> {cmnt} </p>
					<button className="reply-btn"> reply </button>
				</div>
			</div>
		)
	}
	else{
		return(
			<div></div>
		)
	}
}

export default Comment;