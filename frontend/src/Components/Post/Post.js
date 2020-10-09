import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import './Post.css';

//this is done for size control of avatar
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

const Post = ({username,imageUrl,caption}) =>{
	const classes = useStyles();
	return(
		<div className="post-container">
			<div className="post-header">
				<Avatar src='http://abc'
						alt = {username} 
						className={classes.small} 
						size={100}
						/>
				<h4>{username}</h4>
			</div>
			<img className="post-img" alt='xgf' src={imageUrl}/>
			<div className='post-footer'>
				<p><strong>{username}</strong>{ caption}</p>
			</div>
		</div>
	)
}

export default Post;