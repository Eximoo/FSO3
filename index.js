const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/dist'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

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
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const target = persons.find((person) => person.id == Number(id));
  if (target) {
    response.json(target);
  } else {
    response.statusMessage = 'Person was not found';
    response.status(404).send('Person Not found');
  }
});
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const index = persons.findIndex((person) => person.id === Number(id));
  if (index != -1) {
    persons.splice(index, 1);
  }
  response.status(204).send();
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
