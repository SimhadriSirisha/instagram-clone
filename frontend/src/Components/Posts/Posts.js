import React from 'react';
import Post from '../Post/Post';

const Posts = ({postDetails,loadLikes,userid}) =>{
  console.log(postDetails);
	return(
		<div>
		{
			postDetails.map((post,idx)=>{
                return(
                    <Post 
                       key = {post.id} 
                       id = {post.id}
                       username = {post.username} 
                       imageUrl = {post.imageurl}
                       caption = {post.caption}
                       likes = {post.likes}
                       loadLikes = {loadLikes}
                       userid = {userid}
                    />
                );      
            })
		}
		</div>
	)
}

export default Posts;
// user_DP = {post.user_DP}