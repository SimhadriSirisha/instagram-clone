import React from 'react';
import Post from '../Post/Post';

const Posts = ({postDetails}) =>{
  console.log(postDetails);
	return(
		<div>
		{
			postDetails.map((post,idx)=>{
                return(
                    <Post 
                       key = {post.id} 
                       username = {post.username} 
                       imageUrl = {post.imageurl}
                       caption = {post.caption}
                    />
                );      
            })
		}
		</div>
	)
}

export default Posts;
// user_DP = {post.user_DP}