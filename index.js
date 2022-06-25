const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	uuid = require('uuid'),
	mongoose = require('mongoose'), // Import mongoose
	Models = require('./models.js'); // Import models.js
const res = require('express/lib/response');

const Movies = Models.Movie; // Refer to movie model defined in models.js
const Users = Models.User; // Refer to user model defined in models.js

//	Connects to database
mongoose.connect(process.env.CONNECTION_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const app = express();

// 	Allows requests from all origins
const cors = require('cors');
app.use(cors());

// 	Only certain origins allowed access to make requests
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// app.use(
// 	cors({
// 		origin: (origin, callback) => {
// 			if (!origin) return callback(null, true);
// 			if (allowedOrigins.indexOf(origin) === -1) {
// 				//	if a specific origin isnt found on the list of allowed origins
// 				let message =
// 					'The CORS policy for this application doesnt allow access from origin ' +
// 					origin;
// 				return callback(new Error(message), false);
// 			}
// 			return callback(null, true);
// 		},
// 	})
// );

// 	Import express validator library (server-side validation)
const { check, validationResult } = require('express-validator');

//	body-parser
app.use(bodyParser.json()); //	Body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//	middlewares
app.use(morgan('common'));
app.use(express.static('public'));

// 	Import auth and passport js file - must be placed after bodyParser middleware
// 	(app) arguement makes Express available in "auth.js"
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//	GET requests
app.get('/', (request, response) => {
	response.send('Welcome to the Animate');
});

//	Returns a list of all movies
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find()
			.then((movies) => {
				res.status(200).json(movies);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

//	Get documentation
app.get('/documentation', (req, res) => {
	response.sendFile('/public/documentation.html', { root: __dirname });
});

//	Returns data about a single movie by title to the user
app.get(
	'/movies/:Title',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ Title: req.params.Title })
			.then((movie) => {
				res.json(movie);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

//	Returns data about a genre
app.get(
	'/movies/Genre/:Name',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Genre.Name': req.params.Name })
			.then((movie) => {
				res.status(201).json(movie.Genre);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error ' + err);
			});
	}
);

//	Returns data on selected director
app.get(
	'/movies/Director/:Name',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Director.Name': req.params.Name })
			.then((movie) => {
				res.status(201).json(movie.Director);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// Get all users
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then((users) => {
				res.status(201).json(users);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// Get all user by username
app.get(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOne({ Username: req.params.Username })
			.then((user) => {
				if (user) {
					respData = {
						Username: user.Username,
						Email: user.Email,
						Birthday: user.Birthday,
						FavouriteMovies: user.FavouriteMovies,
					};
					res.status(201).json(respData);
				} else {
					res.status(404).send('User Not Found');
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

//	Adds new user data to the list of users
app.post(
	'/users',
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	(req, res) => {
		// 	checks the validation object for errors
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username })
			// search to see if user with the requested username already exitsts
			.then((user) => {
				if (user) {
					//	if user is found, sends a response it already exists
					return res.status(400).send(req.body.Username + ' already exists');
				} else {
					Users.create({
						Username: req.body.Username,
						Password: hashedPassword,
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
	}
);

//	Allows users to update their info
app.put(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	(req, res) => {
		// 	checks the validation object for errors
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
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
	}
);

// 	Deletes user from the list of users
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
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
	}
);

//	Allows users to add movie to favourites
app.post(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
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
	}
);

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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Listening on Port ' + port);
});
