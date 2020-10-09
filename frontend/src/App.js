import React,{useState, useEffect} from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Posts from './Components/Posts/Posts';
import PostInputDailogueBox from './Components/PostInputDailogueBox/PostInputDailogueBox';
import Signin from './Components/Signin/Signin';
import Signup from './Components/Signup/Signup';
import { Route, Switch, Redirect } from 'react-router-dom';

const App = (props) =>{
  const [user,setUser] = useState({
    user_id:'',
    username:'xxx',
    no_of_posts:0,
    followers:0,
    following:0
  });
  const [postDetails, setPostDetails] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:3001/allPost')
    .then((res)=>res.json())
    .then((data)=>{
      setPostDetails(data)
      console.log('inuseeffect',postDetails)
    });
  },[])

  const loadPost = (post) =>{
    const p = postDetails;
    p.unshift(post);
    setPostDetails(p);
    setUser({...user, no_of_posts: post.no_of_posts});
    console.log("loaded post details",postDetails);
  }

  const loadUser = (res_user) =>{
    const {id,username, no_of_posts, followers, following} = res_user;
    setUser({
        user_id: id,
        username,
        no_of_posts,
        followers,
        following
      })
      console.log(user);
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
            <Navbar username={user.username}/>
            <Posts postDetails = {postDetails}/>
          </Route>
          <Route exact path="/profile">
            <Navbar username={user.username}/>

          </Route>
          <Route exact path="/upload">
            <PostInputDailogueBox 
                 user_id = {user.user_id}
                 loadPost = {loadPost} />
          </Route>
        </Switch>
      </div>
    );  
}

export default App;