const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'insta'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/signin',(req,res)=>{
	// we need to body parse as we are getting json as info
	// thats y we require body parser and to use body parser
	// we need express middle ware;
	const {mobile, email, username, password} = req.body;
	let d;
	if(mobile && mobile!='')
		d = mobile;
	else if(email && email!='')
		d = email;
	else
		d = username;
	db('users').select('*')
		.where('email','=',d)
		.orWhere('username','=',d)
		.orWhere('mobile','=',d)
		.then(data => {
			// console.log(data);
			const isValid = bcrypt.compareSync(password,data[0].password);
			if(isValid){
				data[0].password=undefined;
				res.json(data[0]);
			}
			else{
				res.status(400).json('Wrong password');
			}
		})
		.catch(err => res.status(400).json('Wrong email/username/mobile no'));
});

app.post('/signup',(req,res)=>{
	const {mobile, email, name, username, password} = req.body;
	const hash = bcrypt.hashSync(password);
	db.insert({
		name:name,
		email:email,
		username:username,
		mobile:mobile,
		password:hash
   	})
	.into('users')
	.returning(['name','username','no_of_posts','followers','following'])
	.then(user => {
		res.json(user[0]);
		console.log(user[0]);
	})
	.catch(err => {res.status(400).json('unable to register')});
})

app.post('/upload',(req,res)=>{
	const {user_id, caption, imageUrl} = req.body;
	// console.log(user_id,caption,imageUrl);
	db('users').where('id','=',user_id)
			.increment('no_of_posts')
			.returning(['username','no_of_posts'])
			.then(userData =>{
				return db.insert({
					caption:caption,
					imageurl:imageUrl,
					userid:user_id,
					post_time:new Date()
					}).into('post_details')
					.returning('*')
					.then(data =>{
						data = data[0];
						userData[0] = {...userData[0], ...data};
						res.json(userData[0]);
					})
					.catch(err => res.status(400).json('unable to upload'));
			})
			.catch(err => res.status(400).json('unable to increment'));
})


app.get('/allPost',(req,res)=>{
	db('post_details')
		.join('users','post_details.userid','=','users.id')
		.select(['post_details.id','post_details.caption','post_details.imageurl','users.username'])
		.orderBy('post_details.post_time','desc')
		.then(posts => {
			res.json(posts);
		})
		.catch(err => res.status(400).json('unable to fetch'));
})

app.listen(3001,()=>{
	console.log('server is running on port 3001');
});