const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');

const app = express();

let users = [
	{
		id: 1,
		userName: 'johnny30',
		fullName: 'John Doe',
		emailAddress: 'johndoeABC@gmail.com',
		favourites: ['Your Name', 'Ponyo'],
	},

	{
		id: 2,
		userName: 'suzee30',
		fullName: 'Suzy May',
		emailAddress: 'suzymayABC@gmail.com',
		favourites: ['Bubble', 'NiNoKuni'],
	},
];

let movies = [
	{
		title: 'Your Name',
		description:
			"A bored girl in the countryside starts sporadically waking up in the body of a city boy who's living the exciting life she'd always dreamed of.",
		genre: 'Romance Anime',
		director: { name: 'Makoto Shinkai', bio: 'Makoto Shinkai bio' },
	},
	{
		title: 'Bubble',
		description:
			'In an abandoned Tokyo overrun by bubbles and gravitational abnormalities, one gifted young man has a fateful meeting with a mysterious girl.',
		genre: 'Sci-fi Films',
		director: { name: 'Tetsuro Araki', bio: 'director bio' },
	},
	{
		title: 'Ponyo',
		description:
			'A 5-year-old boy named Sosuke forges a friendship with a goldfish princess named Ponyo, who desperately wants to become human.',
		genre: 'Family Features',
		director: { name: 'Hayao Miyazaki', bio: 'director bio' },
	},
	{
		title: 'A Whisker Away',
		description:
			"A peculiar girl transforms into a cat to catch her crush's attention. But before she realizes it, the line between human and animal starts to blur.",
		genre: 'Fantasy',
		director: [
			{ name: 'Junichi Sato', bio: 'director bio' },
			{ name: 'Tomotaka Shibayama', bio: 'director bio' },
		],
	},
	{
		title: 'Flavours of Youth',
		description:
			'Memories in a bowl of steaming noodles, a fading beauty finding her way and a bittersweet first love -- all in these stories of city life in China.',
		genre: 'Japanese',
		director: { name: 'Xiaoxin Yi', bio: 'director bio' },
	},
	{
		title: 'The Daily Life of the Immortal King',
		description:
			'As a cultivation genius who has achieved a new realm every two years since he was a year old, Wang Ling is a near-invincible existence with prowess far beyond his control.',
		genre: 'School Anime',
		director: { name: 'Ku Xuan', bio: 'director bio' },
	},
	{
		title: 'Tokyo Godfathers',
		description:
			"After finding an abandoned baby on Christmas Eve, three homeless people go in search of the child's parents, meeting a host of oddballs along the way.",
		genre: 'LGBTQ Films',
		director: { name: 'Satoshi Kon', bio: 'director bio' },
	},
	{
		title: 'New Gods: Nezha Reborn',
		description:
			'While living as an ordinary deliveryman and motor racing fan, Nezha encounters old nemeses and must rediscover his powers to protect his loved ones.',
		genre: 'Anime Action',
		director: { name: 'Zhao Ji', bio: 'director bio' },
	},
	{
		title: 'GANTZ:O',
		description:
			"Teams of recently deceased people who've been revived and given high-tech weapons must cooperate to defeat an army of monsters in Tokyo and Osaka.",
		genre: 'Anime Action',
		director: [
			{ name: 'Keiichi Sato', bio: 'director bio' },
			{ name: 'Yashushi Kawamura', bio: 'director bio' },
		],
	},
	{
		title: 'NiNoKuni',
		description:
			'Two average teens go on a magical quest to save the life of their friend and her counterpart from another world. But love complicates their journey.',
		genre: 'Japanese',
		director: { name: 'Yoshiyuki Momose', bio: 'director bio' },
	},
];

//	Morgan middleware - logs request
app.use(morgan('common'));

//	Body-parser
app.use(bodyParser.json());

//	Serving Static Files - Documentation.html file
app.use(express.static('public'));

//	GET requests
app.get('/', (request, response) => {
	response.send('Welcome to the Animate');
});

app.get('/movies', (request, response) => {
	response.json(movies);
});

app.get('/documentation', (request, response) => {
	response.sendFile('/public/documentation.html', { root: __dirname });
});

//	Returns data on selected movie
app.get('/movies/:title', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.title === req.params.title;
		})
	);
	res.send('Request was successful');
});

//	Returns data on selected genre
app.get('/movies/genre/:genre', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.genre === req.params.genre;
		})
	);
	if (result) {
		res.status(200).send('Request was successful');
	} else {
		res.status(400).send('Cannot find any for genre');
	}
});

//	Returns data on selected director
app.get('/movies/director/:name', (req, res) => {
	res.json(
		movies.find((movie) => {
			return movie.director.name === req.params.name;
		})
	);
	if (result) {
		res.status(200).send('Request was successful');
	} else {
		res.status(400).send('Cannot find any for genre');
	}
});

//	Adds new user data to the list of users
app.post('/users', (req, res) => {
	let newUser = req.body;

	if (!newUser.name) {
		const message = 'Please enter new username';
		res.status(400).send(message);
	} else {
		newUser.id = uuid.v4();
		users.push(newUser);
		res.status(201).send(newUser);
	}
});

//	Allows users to update their username
app.put('/users/:userName', (req, res) => {
	res.send('Request was successful - user data updated');
});

// 	Deletes user from the list of users using ID
app.delete('/users/:id', (req, res) => {
	//	Code wasnt working - need to review again
	// let user = users.find((user) => {
	// 	return user.id === req.params.id;
	// });

	// if (user) {
	// 	users = user.filter((user) => {
	// 		return obj.id !== req.params.id;
	// 	});
	// 	res.status(201).send('User ' + req.params.id + ' was deleted.');
	// }
	res.send('User successfully removed');
});

//	Allows users to add movie to favourites
app.post('/users/:user/favourites', (req, res) => {
	res.send('This movie has been added to your favourites');
});

//	Allows users to remove movie to favourites
app.delete('/users/:user/favourites', (req, res) => {
	res.send('This movie has been removed to your favourites');
});

// 	Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080');
});
