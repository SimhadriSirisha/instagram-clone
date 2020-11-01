import React from 'react';
import SingleComment from './SingleComment';

const ReplyComment = ({prev_comment_id, updateComment, userid, commentList, replyto}) => {
	return (
		<div> 
			{commentList && commentList.map((commentData,idx) =>{
					if(commentData.parent_id === prev_comment_id){
						return(
							<div>
								<div style={{marginLeft:"3rem"}}>
									<SingleComment key={idx}
												   commentData={commentData}
												   updateComment = {updateComment}
												   userid = {userid}
												   replyto = {replyto}/>
								</div>
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

export default ReplyComment;