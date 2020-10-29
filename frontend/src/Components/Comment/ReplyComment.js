import React from 'react';
import SingleComment from './SingleComment';

const ReplyComment = ({prev_comment_id, username, updateComment, userid, commentList,replyto}) => {
	return (
		<div> 
			{commentList && commentList.map((commentData,idx) =>{
					if(commentData.parent_id === prev_comment_id){
						console.log(commentData);
						return(
							<div>
							<div style={{marginLeft:"3rem"}}>
								<SingleComment key={idx}
											   commentData={commentData}
											   username = {username}
											   updateComment = {updateComment}
											   userid = {userid}
											   replyto = {replyto}/>
							</div>
							<ReplyComment key={idx}
										  prev_comment_id = {commentData.id}
										  username = {username}
										  updateComment = {updateComment}
										  userid = {userid}
										  commentList = {commentList}/>
							</div>
						)
					}
				})
			}
		</div>
	)
}

export default ReplyComment;