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

db.schema.hasTable('comments').then((exists) => {
  if (!exists) {
  	console.log("not present");
    return db.schema.createTable('comments', (t) => {
      t.increments('id').primary();
      t.integer('parent_id').defaultTo(0);
      t.text('comment').notNullable();
      t.integer('userid').notNullable();
      t.integer('postid').notNullable();
      t.timestamp('createdAt');
      t.foreign('postid').references('postid').inTable('post_details')
      	.onUpdate('CASCADE')
      	.onDelete('CASCADE');
    });
  }
});


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
	.returning('*')
	.then(user => {
		user.password = undefined;
		res.json(user[0]);
		console.log(user[0]);
	})
	.catch(err => {res.status(400).json('unable to register')});
})

//change it to transaction type
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
		.select(['post_details.id','post_details.caption','post_details.imageurl','users.username','post_details.likes'])
		.orderBy('post_details.post_time','desc')
		.then(posts => {
			res.json(posts);
		})
		.catch(err => res.status(400).json('unable to fetch'));
})

app.get('/profile/:id',(req,res)=>{
	const {id} = req.params;
	db('post_details')
		.join('users','post_details.userid','=','users.id')
		.select(['post_details.id','post_details.caption','post_details.imageurl','users.username','post_details.userid','post_details.likes'])
	  	.where('userid','=',id)
	  	.then(data => {
	  		res.json(data);
	 	})
	  	.catch(err => res.status(400).json('unable to fetch'));
})

app.post('/editProfile',(req,res)=>{
	const {id, name, bio, pn, email, username} = req.body;
	db('users').where('id','=',id)
		.update({
			id,
			name,
			bio,
			mobile: pn,
			username,
			email
		})
		.returning('*')
		.then(data =>{
			res.json(data[0]);
		})
		.catch(err => res.status(400).json('unable to update the profile'))
})

app.put('/likes',(req,res)=>{
	const {userid,postid} = req.body;
	db.transaction(trx=>{
		trx('likes').select('*').where({
			postid,
			userid
		})
		.then(data => {
			console.log('data',data);
			if(data.length){
				console.log("user already liked the post");
				return trx('post_details').select('likes')
							.where('id','=',data[0].postid)
							.then(likes => {
								res.json(likes[0].likes);
							})
							.catch(err => res.status(400).json('unable to likes data'));
			}
			else{
				return trx.insert({
					postid,
					userid
				}).into('likes')
				.returning('postid')
				.then(postId =>{
					console.log('postid',postId);
					return trx('post_details')
								.where('id','=',postId[0])
								.increment('likes')
								.returning('likes')
								.then(likes => {
									res.json(likes[0]);
								})
								.catch(err => res.status(400).json('unable to update'));
				})
				.then(trx.commit)
				.catch(trx.rollback)
			}
		})
		.catch(err => res.status(400).json('unable to get likes table data'));
	})
})

app.put('/unlike',(req,res)=>{
	const {postid} = req.body;
	db.transaction(trx => {
		trx('post_details').where('id','=',postid)
			.decrement('likes')
			.returning(['userid','likes'])
			.then(data => {
				return trx('likes').where({
					'userid':data[0].userid,
					postid
				}).del()
				.then(res.json(data[0].likes))
				.then(trx.commit)
				.catch(trx.rollback)
			})
			.catch(err => res.status(400).json('no post present'))
	})
})

app.put('/comment',(req,res)=>{
	const {comment,userid,postid} = req.body;
	console.log(req.body);
	db('comments').insert({
		comment,
		userid,
		postid,
		createdAt : new Date()
	}).returning('*')
	.then(data =>{
		console.log('in /comment',data);
		res.json(data[0])
	})
	.catch(err => res.status(400).json("can't insert"));
})

app.get('/allComment/:postid',(req,res)=>{
	const postid = req.params;

	db('comments AS c')
  		.join('post_details AS p', (joinBuilder) => {
    		return joinBuilder.on('p.id', '=', 'c.postid').andOn('c.postid', '=', db.raw('?', [postid]));
  	})
  	.join('users AS u', 'u.id', '=', 'c.userid')
  	.select(['c.id', 'c.parent_id', 'c.comment', 'u.username', 'c.postid', 'c.userid'])
  	.then((data) => {
 	   	console.log(data);
    	res.json(data);
  	})
  	.catch(console.log);
})

app.listen(3001,()=>{
	console.log('server is running on port 3001');
});