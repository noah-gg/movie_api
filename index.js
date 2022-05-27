const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	uuid = require('uuid'),
	mongoose = require('mongoose'), // Import mongoose
	Models = require('./models.js'); // Import models.js
const res = require('express/lib/response');

const Movies = Models.Movie; // Refer to movie model defined in models.js
const Users = Models.User; // Refer to user model defined in models.js

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json()); //	Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(express.static('public'));

//	GET requests
app.get('/', (request, response) => {
	response.send('Welcome to the Animate');
});

//	Returns a list of all movies
app.get('/movies', (req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(200).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//	Get documentation
app.get('/documentation', (req, res) => {
	response.sendFile('/public/documentation.html', { root: __dirname });
});

//	Returns data about a single movie by title to the user
app.get('/movies/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			res.json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//	Returns data about a genre
app.get('/movies/Genre/:Name', (req, res) => {
	Movies.findOne({ 'Genre.Name': req.params.Name })
		.then((movie) => {
			res.status(201).json(movie.Genre);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error ' + err);
		});
});

//	Returns data on selected director
app.get('/movies/Director/:Name', (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Name })
		.then((movie) => {
			res.status(201).json(movie.Director);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get all users
app.get('/users', (req, res) => {
	Users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//	Adds new user data to the list of users
app.post('/users', (req, res) => {
	Users.findOne({ Username: req.body.Username })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Username + ' already exists');
			} else {
				Users.create({
					Username: req.body.Username,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				})
					.then((user) => {
						res.status(201).json(user);
					})
					.catch((error) => {
						console.error(error);
						res.status(500).send('Error: ' + error);
					});
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//	Allows users to update their info
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true }, // this line makes sure that the updated docuement is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// 	Deletes user from the list of users
app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + ' was not found');
			} else {
				res.status(200).send(req.params.Username + ' was deleted');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//	Allows users to add movie to favourites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{ $push: { FavouriteMovies: req.params.MovieID } },
		{ new: true }, // This line makes sure that the updated document is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

//	Allows users to remove movie to favourites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{ $pull: { FavouriteMovies: req.params.MovieID } },
		{ new: true }, // this line makes sure that the updated document is returned
		(err, updatedUser) => {
			if (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			} else {
				res.json(updatedUser);
			}
		}
	);
});

// 	Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// 	Listens for requests
app.listen(8080, () => {
	console.log('Your app is listening on port 8080');
});
