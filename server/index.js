const express = require('express');
const uuid = require('uuid');
const data = require('./deals');
const app = express();

const logger = (req, res, next) => {
	console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
	next();
};

app.use(logger);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/api/deals', (req, res) => {
	const { sort } = req.query;
	delete req.query.sort;
	if (sort) {
		const [property, order] = sort.split('.');
		data.sort(sortBy(property, order === 'desc'));
	}
	return res.status(200).json(data);
});

app.post('/api/deals', (req, res) => {
	const newDeal = {
		name: req.body.name,
		dealID: uuid.v4(),
		updated: +new Date(),
	};
	if (!newDeal.name) {
		return res.status(400).json({ err: 'Please provide Name.' });
	} else {
		// add new deal into DB
		data.push(newDeal);
		return res.status(200).json(newDeal);
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const sortBy = (field, reverse, primer) => {
	const key = primer
		? function (x) {
				return primer(x[field]);
		  }
		: function (x) {
				return x[field];
		  };

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
	};
};