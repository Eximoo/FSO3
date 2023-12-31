const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.static(__dirname + '/dist'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

const Person = require('./models/person');

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has ${persons.length} entries </p><p>${new Date()}</p>`
    );
  });
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

app.put('/api/persons', (request, response, next) => {
  Person.create(request.body)
    .then((result) => response.send(result))
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  if (request.params.id) {
    Person.findByIdAndUpdate(request.params.id, request.body, {
      runValidators: true,
      context: 'query',
      upsert: true,
      new: true,
    })
      .then((result) => response.send(result))
      .catch((error) => next(error));
  } else {
    response.status(404).send();
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformation in id param' });
  } else if (error.name === 'ValidationError') {
    console.log(`inside validation error: ${error.message}`);
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
