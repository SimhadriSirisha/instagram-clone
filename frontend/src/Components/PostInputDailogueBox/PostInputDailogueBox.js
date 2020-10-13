import React,{useState,useEffect} from 'react';
import './PostInputDailogueBox.css';
import { useHistory } from "react-router-dom";

const PostInputDailogueBox = ({user_id, loadPost}) =>{
  const [caption,setCaption] = useState('');
  const [image,setImage] = useState('');
  const [loading,setLoading] = useState(false);
  const [click, setClick] = useState(true);
  const [url,setUrl] = useState('');

  let history = useHistory();

  useEffect(()=>{
    const container = document.querySelector('.overlay');
    console.log("click",click);
    if(click === true){
      container.classList.add('open-overlay');
    }
    else{
      container.classList.remove('open-overlay');
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
        // history.push('/home');
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
          <button className="close-btn" onClick = {closeUpload}><i className="fas fa-times"></i></button>
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
    </div>
  )
}

export default PostInputDailogueBox;