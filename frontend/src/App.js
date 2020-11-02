import React,{useState, useEffect} from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Posts from './Components/Posts/Posts';
import Edit_Profile from './Components/Edit_Profile/Edit_Profile';
import Profile from './Components/Profile/Profile';
import DailogueBox from './Components/DailogueBox/DailogueBox';
import Signin from './Components/Signin/Signin';
import Signup from './Components/Signup/Signup';
import { Route, Switch, Redirect } from 'react-router-dom';

const App = (props) =>{
  const [user,setUser] = useState({
    user_id: 0,
    email:'xyz@xyz.com',
    mobile:'999',
    username:'xxx',
    no_of_posts:0,
    followers:0,
    following:0,
    name:'xxx',
    bio:'yzaaa'
  });
  const [postDetails, setPostDetails] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:3001/allPost')
    .then((res)=>res.json())
    .then((data)=>{
      setPostDetails(data)
    });
  })

  useEffect(()=>{
    fetch(`http://localhost:3001/allLikes/${user.user_id}`)
      .then((res)=>res.json())
      .then((data)=>{
        setLikedPosts(data)
      });    
  },[user.user_id])

  const loadNoOfPosts = (n) =>{
    setUser({...user, no_of_posts: n});
  }

  const loadPost = (post) =>{
    const p = postDetails;
    p.unshift(post);
    setPostDetails(p);
    loadNoOfPosts(post.no_of_posts);
    // setUser({...user, no_of_posts: post.no_of_posts});
  }

  const loadUser = (res_user) =>{
    const {id, name, username, mobile, no_of_posts, followers, following, bio, email} = res_user;
    setUser({
        user_id: id,
        username,
        mobile,
        no_of_posts,
        followers,
        following,
        name,
        bio,
        email
      })
  }

  const loadEditedUser = (res_user) =>{
    const {id, name, username, mobile, bio, email} = res_user;
    setUser({
        user_id: id,
        username,
        mobile,
        name,
        bio,
        email
      })
  }

  const loadLikes = (data) =>{
    const p = postDetails;
    p.forEach((post) =>{
      if(post.id === data.id){
        post.likes = data.likes;
      }
    })
    setPostDetails(p);
  }

  return (
      <div className="App">
        <Switch>
          <Route exact path="/signin">
            <Signin loadUser = {loadUser}/>
          </Route>
          <Route exact path="/">
            <Redirect to="/signin" />
          </Route>
          <Route exact path="/signup" >
            <Signup loadUser = {loadUser}/>
          </Route>
          <Route exact path="/home">
            <Navbar username={user.username}
                    user_id = {user.user_id}/>
            <Posts postDetails = {postDetails}
                   loadLikes = {loadLikes}
                   userid = {user.user_id}
                   username={user.username}
                   likedPosts = {likedPosts}/>
          </Route>
          <Route exact path="/profile/:id">
            <Navbar username={user.username}
                    user_id = {user.user_id}/>
            <Profile user = {user}/>
          </Route>
          <Route exact path="/edit_profile">
            <Navbar username={user.username}
                    user_id = {user.user_id}/>
            <Edit_Profile user = {user}
                          loadEditedUser = {loadEditedUser}/>
          </Route>
          <Route path="/box">
            <DailogueBox 
                 user_id = {user.user_id}
                 loadPost = {loadPost} 
                 loadLikes = {loadLikes}
                 loadNoOfPosts = {loadNoOfPosts}/>
          </Route>
        </Switch>
      </div>
    );  
}

export default App;