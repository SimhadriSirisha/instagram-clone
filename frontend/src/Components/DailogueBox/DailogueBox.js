import React,{useState,useEffect} from 'react';
import './DailogueBox.css';
import { useHistory, useLocation } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import Post from '../Post/Post';
import ShowComments from '../Comment/ShowComments';

const DailogueBox = ({user_id, loadPost, loadLikes, loadNoOfPosts}) =>{
  const [caption,setCaption] = useState('');
  const [image,setImage] = useState('');
  const [loading,setLoading] = useState(false);
  const [click, setClick] = useState(true);
  const [url,setUrl] = useState('');
  const [showAllComment,setShowAllComment] = useState(false);
  const [delFailed,setDelFailed] = useState(false);
  const [userPost,setPost]  = useState({
    id:0,
    username:'',
    imageUrl:'',
    caption:'',
    likes:0,
    userid:0
  });
  const [comment_details,setCommentDetails] = useState({
    commentList:[],
    userid:0, 
    postid:0,
    username:'',
    comment_uname:''
  })

  let history = useHistory();
  let location = useLocation();

  const updateComment2 = (newComment) => {
    let cmnts = comment_details.commentList;
    cmnts = cmnts.concat(newComment);
    setCommentDetails({...comment_details, commentList:cmnts}) 
  }

  useEffect(()=>{
    const container = document.querySelector('.overlay');
    const upload_block = document.querySelector('.uploading_data');
    const show_post_block = document.querySelector('.show_post');
    const overlay_container = document.querySelector('.overlay-container');
    upload_block.classList.remove('showBlock');
    show_post_block.classList.remove('showBlock');

    if(click === true){
      container.classList.add('open-overlay');
    }
    else{
      container.classList.remove('open-overlay');
    }

    if (location.pathname === '/box') {
      upload_block.classList.add('showBlock');
    }
    else if(location.pathname === '/box/comments'){
      setCommentDetails(history.location.state);
      setShowAllComment(true);
      overlay_container.classList.add('post-overlay-container');
    }
    else{
      setPost(location.state.post)
      show_post_block.classList.add('showBlock');
      overlay_container.classList.add('post-overlay-container');
    }
  },[click]);

  const goHome = () =>{
    setClick(false);
    history.push('/home');
  }

  const postUpload = () =>{
      fetch('http://localhost:3001/upload',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            user_id: user_id,
            caption: caption,
            imageUrl: url
          })
        })
        .then(res => res.json())
        .then(post => {
          if(post){
            loadPost(post);
            setLoading(false);
            goHome();
          }
      })
  }

  useEffect(()=>{
    if(url !== ''){
      postUpload();
    }
  },[url]);

  const closeUpload = () =>{
        setClick(false);
        history.goBack();
  }

  const deleteFailed = () => {
    setDelFailed(true);
  }

  const onSubmitUpload = (e) =>{
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("file",image);
    data.append("upload_preset","insta_clone");
    data.append("cloud_name","siricloud");
    fetch("https://api.cloudinary.com/v1_1/siricloud/image/upload",{
          method:"POST",
          body:data
        })
        .then(res => res.json())
        .then(file => {
          setUrl(file.secure_url);
        })
        .catch(err => console.log("unable to load image"));
  }

  return(
    <div className="overlay">
      <div className="overlay-container">
          <button className="close-btn" onClick = {closeUpload}><CloseIcon color="action"/></button>      
          <div className = "uploading_data">
            <form onSubmit = {onSubmitUpload}>
              <input className="inputblk" 
                     type="text" 
                     placeholder="type caption..." 
                     onChange={e => setCaption(e.target.value)}/><br/>
              <input type="file" 
                     onChange={e => setImage(e.target.files[0])}/><br/>
              <input className="input-btn" 
                     value = 'Upload'
                     type = "submit"/>
            </form>
            {
              loading && (<h3> Loading ...</h3>)
            }
          </div>
          <div className="show_post">
            <Post id = {userPost.id}
                  username = {userPost.username} 
                  imageUrl = {userPost.imageurl}
                  caption = {userPost.caption}
                  likes = {userPost.likes}
                  loadLikes = {loadLikes}
                  userid = {userPost.userid}
                  goHome = {goHome}
                  deleteFailed = {deleteFailed}
                  loadNoOfPosts = {loadNoOfPosts}/>
            {(delFailed) && <p style={{color:"red"}}> unable to delete </p> }
          </div>
           <div className="comment_blk">
              {
                (showAllComment) && <ShowComments  userid={comment_details.userid}
                                           postid={comment_details.postid}
                                           username={comment_details.username}
                                           updateComment={updateComment2}
                                           commentList={comment_details.commentList}
                                           comment_uname={comment_details.comment_uname}/>
              }
           </div>
      </div>
    </div>
  )
}

export default DailogueBox;