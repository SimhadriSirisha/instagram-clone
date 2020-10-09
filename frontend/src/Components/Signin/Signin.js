import React,{useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Signin.css';

const Signin = (props) =>{
  const [signinEmail, setEmail] = useState('');
  const [signinPswrd, setPswrd] = useState('');
  const [signinMobileNo, setMobileNo] = useState('');
  const [signinUsername, setUsername] = useState('');
  const [err, setError] = useState('');
  const history = useHistory();

  useEffect(()=>{
    const p = document.querySelector('.login-pblm');
    if(err===''){
          p.classList.remove('active');
    }
    else{
      p.classList.add('active');
    }
  },[err]);

  const onEmailChange = (event) => {
    const numformat = /^\d{10}$/;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const str = event.target.value;
    if(str.match(numformat)){
      setMobileNo(str);
    }
    else if(str.match(mailformat)){
      setEmail(str);
    }
    else{
      setUsername(str);
    }
  }

  const onSubmitSignin = (event) =>{
    event.preventDefault();
    if((signinEmail || signinMobileNo || signinUsername) && signinPswrd){
      fetch('http://localhost:3001/signin',{
        method:'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          email: signinEmail,
          password: signinPswrd,
          username: signinUsername,
          mobile: signinMobileNo
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.id){
          console.log("successs");
          setError('');
          props.loadUser(data);
          // onRouteChange('home');
          history.push({pathname:'/home'});
        }
        else{
          setError('error');
        }
      })
    }
    else{
      setError('error');
    }
  }

  return(
      <div className="signin-container">
        <div className = "signin-center">
            <div className='logo-img'>
              <img alt='insta-name' src={require('../images/logo_name.png')}/>
            </div>
            <form className="signin-forms" onSubmit={onSubmitSignin}>
              <input className="inputblk" 
                placeholder=" Phone number, email or username" 
                type="text" 
                onChange={onEmailChange}/><br/>
              <input 
                className="inputblk" 
                placeholder=" Password" 
                type="password" 
                onChange={(event) => setPswrd(event.target.value)}/><br/>
              <input 
                 className="input-btn" 
                 value="Log In" 
                 type="submit"/>
            </form>
            <p className='login-pblm'> Wrong input!! please try again! </p> 
        </div>
        <div className="second-option-blk">
          <p> Don't have an account? 
              <span>
                <Link to="/signup" className="second-option-btn">Sign up</Link>
              </span>
          </p>
        </div>
      </div>
    )
}

export default Signin;