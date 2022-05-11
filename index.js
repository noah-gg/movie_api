const express = require('express');
const app = express();

const bodyParser = require('body-parser');

let topMovies = [
	{
		movie: 'Your Name',
		description:
			"A bored girl in the countryside starts sporadically waking up in the body of a city boy who's living the exciting life she'd always dreamed of.",
		genre: ['Japanese', 'Romance Anime', 'School Anime'],
		director: 'Makoto Shinkai',
	},
	{
		movie: 'Bubble',
		description:
			'In an abandoned Tokyo overrun by bubbles and gravitational abnormalities, one gifted young man has a fateful meeting with a mysterious girl.',
		genre: ['Japanese', 'Sci-fi Films', 'Romance Anime'],
		director: 'Tetsuro Araki',
	},
	{
		movie: 'Ponyo',
		description:
			'A 5-year-old boy named Sosuke forges a friendship with a goldfish princess named Ponyo, who desperately wants to become human.',
		genre: ['Japanese', 'Family Features', 'Anime Feature Films'],
		director: 'Hayao Miyazaki',
	},
	{
		movie: 'A Whisker Away',
		description:
			"A peculiar girl transforms into a cat to catch her crush's attention. But before she realizes it, the line between human and animal starts to blur.",
		genre: 'Japanese, Fantasy, Romance Anime',
		director: ['Junichi Sato', 'Tomotaka Shibayama'],
	},
	{
		movie: 'Flavours of Youth',
		description:
			'Memories in a bowl of steaming noodles, a fading beauty finding her way and a bittersweet first love -- all in these stories of city life in China.',
		genre: ['Japanese', 'Romance Anime'],
		director: 'Xiaoxinf Yi',
	},
	{
		movie: 'The Daily Life of the Immortal King',
		description:
			'As a cultivation genius who has achieved a new realm every two years since he was a year old, Wang Ling is a near-invincible existence with prowess far beyond his control.',
		genre: ['Japanese', 'School Anime'],
		director: 'Ku Xuan',
	},
	{
		movie: 'Tokyo Godfathers',
		description:
			"After finding an abandoned baby on Christmas Eve, three homeless people go in search of the child's parents, meeting a host of oddballs along the way.",
		genre: ['Japanese', 'Social Issue Drama', 'LGBTQ Films'],
		director: 'Satoshi Kon',
	},
	{
		movie: 'New Gods: Nezha Reborn',
		description:
			'While living as an ordinary deliveryman and motor racing fan, Nezha encounters old nemeses and must rediscover his powers to protect his loved ones.',
		genre: ['Anime Action', 'Sci-Fi & Fantasy Anime', 'Anime Feature Films'],
		director: 'Zhao Ji',
	},
	{
		movie: 'GANTZ:O',
		description:
			"Teams of recently deceased people who've been revived and given high-tech weapons must cooperate to defeat an army of monsters in Tokyo and Osaka.",
		genre: ['Japanese', 'Anime Action', 'Sci-Fi Films'],
		director: ['Keiichi Sato', 'Yashushi Kawamura'],
	},
	{
		movie: 'NiNoKuni',
		description:
			'Two average teens go on a magical quest to save the life of their friend and her counterpart from another world. But love complicates their journey.',
		genre: ['Japanese', 'Sci-Fi & Fantasy Anime', 'Anime Feature Films'],
		director: 'Yoshiyuki Momose',
	},
];

//	GET requests
app.get('/movies', (request, response) => {
	response.json(topMovies);
});

app.get('/', (request, response) => {
	response.send('Welcome to the Animate');
});

app.get('/documentation', (request, response) => {
	response.sendFile('/public/documentation.html', { root: __dirname });
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080');
});
