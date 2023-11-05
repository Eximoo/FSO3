const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.static(__dirname + '/dist'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const Person = require('./models/person');
const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
  // response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.get('/index.html', (request, response) => {
  response.sendFile('./dist/index.html');
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(response.status(204).send());
});
app.post('/api/persons', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).send({ error: 'All fields are required' });
  }
  if (persons.find((person) => person.name === request.body.name)) {
    return response
      .status(400)
      .send({ error: 'Person with that already exists' });
  }
  persons.push({ id: Math.floor(Math.random() * 1000000000), ...request.body });
  response.send(request.body);
});

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' });
// };

// app.use(unknownEndpoint);
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
