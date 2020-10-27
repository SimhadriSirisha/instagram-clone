import React,{useState,useEffect} from 'react';
import './DailogueBox.css';
import { useHistory, useLocation } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close';
import Post from '../Post/Post';

const DailogueBox = ({user_id, loadPost, loadLikes}) =>{
  const [caption,setCaption] = useState('');
  const [image,setImage] = useState('');
  const [loading,setLoading] = useState(false);
  const [click, setClick] = useState(true);
  const [url,setUrl] = useState('');
  const [userPost,setPost]  = useState({
    id:0,
    username:'',
    imageUrl:'',
    caption:'',
    likes:0,
    userid:0
  });

  let history = useHistory();
  let location = useLocation();

  useEffect(()=>{
    const container = document.querySelector('.overlay');
    const upload_block = document.querySelector('.uploading_data');
    const show_post_block = document.querySelector('.show_post');
    const overlay_container = document.querySelector('.overlay-container');
    upload_block.classList.remove('showBlock');
    show_post_block.classList.remove('showBlock');

    console.log("click",click);
    if(click === true){
      container.classList.add('open-overlay');
    }
    else{
      container.classList.remove('open-overlay');
    }

    if (location.pathname === '/box') {
      console.log('box location');
      upload_block.classList.add('showBlock');
    }
    else{
      setPost(location.state.post)
      console.log('show_post location');
      show_post_block.classList.add('showBlock');
      overlay_container.classList.add('post-overlay-container');
    }
  },[click]);

  const postUpload = () =>{
    console.log('got url',url);
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
            console.log("successs");
            loadPost(post);
            setLoading(false);
            setClick(false);
            history.push('/home');
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

  const onSubmitUpload = (e) =>{
    e.preventDefault();
    console.log("clicked");
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
          console.log(file.secure_url);
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
                  userid = {userPost.userid}/>
          </div>
      </div>
    </div>
  )
}

export default DailogueBox;