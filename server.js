const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB (Updated)
mongoose.connect('mongodb://localhost:27017/blogDB');

// Define Mongoose Schema
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { posts: posts });
  } catch (err) {
    console.error(err);
    res.send('An error occurred while fetching posts.');
  }
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('An error occurred while saving the post.');
  }
});

app.get('/posts/:postId', async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render('post', {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.send('An error occurred while fetching the post.');
  }
});

app.listen(3000, function() {
  console.log('Server started on port 3000');
});
