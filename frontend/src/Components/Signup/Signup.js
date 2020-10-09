import React,{useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Signup.css';

const Signup = (props) =>{
  const [mobile,setMobile] = useState('');
  const [Email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [username,setUsername] = useState('');
  const [error,setError] = useState('');
  const history = useHistory();

  const errorDisplay = (err,p) =>{
    if(err === ''){
      p.classList.remove('active');
    }
    else{
      p.classList.add('active');
    }
  }

  useEffect(()=>{
    const p = document.getElementById('error');
    errorDisplay(error,p);
  },[error]);

  const onMobileChange =(event) =>{
    const numformat = /^\d{10}$/;
    let str = event.target.value;
    if(str.match(numformat)){
      console.log("its a number");
      setMobile(str);
    }
  }

  const onEmailChange =(event)=>{
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let str = event.target.value;
    if(str.match(mailformat)){
      console.log("its an email");
      setEmail(str);
    }
  }

  const onSubmitSignup = (event) => {
    event.preventDefault();
    if(mobile === '' || Email === '' || password.length < 6){
      setError("error");
    }
    else{
      setError("");
      setError("");
      fetch('http://localhost:3001/signup',{
        method:'post',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            mobile: mobile,
            email: Email,
            name:name,
            password: password,
            username: username
          })
        })
        .then(res => res.json())
        .then(user => {
          if(user.id){
            console.log("successs");
            props.loadUser(user);
            // this.props.onRouteChange('home');
            history.push({
              pathname:'/home'
            })
          }
          else{
            setError("error");
          }
      })
    }
  }

  return(
      <div className="signup-container">
        <div className = "signup-center">
          <div className='logo-img'>
            <img alt='insta-name' src={require('../images/logo_name.png')}/>
          </div>
          <p className="top-para">Sign up to see photos and videos from your friends.</p>
          <form className="signup-forms" onSubmit={onSubmitSignup}>
            <p className="red" id="error">Unable to register (check all fields like password must have atleast 6 characters, unique username, correct mobile number & email) </p>
            <input className="inputblk" 
                   placeholder=" Email" 
                   type="text"
                   onChange = {onEmailChange}/><br/>
            <input className="inputblk" 
                   placeholder=" Mobile Number" 
                   type="text"
                   onChange = {onMobileChange}/><br/>
            <input className="inputblk" 
                   placeholder=" Full Name" 
                   type="text"
                   onChange = {e => setName(e.target.value)}/><br/>
            <input className="inputblk" 
                   placeholder=" Username" 
                   type="text"
                   onChange = {e => setUsername(e.target.value)}/><br/>
            <input className="inputblk"
                   placeholder=" Password"
                   type="password"
                   onChange = {e => setPassword(e.target.value)}/><br/>
            <input className="input-btn"
                   value="Sign up" 
                   type="submit"/>
          </form>
          <p className="bottom-para"> By signing up, you agree to our Terms , Data Policy and Cookies Policy .</p>
        </div>
        <div className="second-option-blk second-option-blk2">
          <p> Have an account? <span><Link to="/signin" className="second-option-btn">Log in</Link></span></p>
        </div>
      </div>
    )

}

export default Signup;