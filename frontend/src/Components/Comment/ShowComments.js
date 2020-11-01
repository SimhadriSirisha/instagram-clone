import React,{useState, useEffect} from 'react';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const ShowComments = ({userid,postid,username,updateComment,commentList,comment_uname}) =>{

	return(
		<div>
			{commentList && commentList.map((commentData,idx) =>{
					if(commentData.parent_id === 0){
						return(
							<div>
							<SingleComment key={idx}
										   commentData={commentData}
										   updateComment = {updateComment}
										   userid = {userid}/>
							<ReplyComment key={idx+1}
										  prev_comment_id = {commentData.id}
										  updateComment = {updateComment}
										  userid = {userid}
										  commentList = {commentList}
										  replyto = {commentData.username}/>
							</div>
						)
					}
				})
			}
		</div>
	)
}

export default ShowComments;