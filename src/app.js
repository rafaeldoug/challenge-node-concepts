const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();
}

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs=[] } = req.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return res.status(201).json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (req, res) => {
  const { id } = req.params;
  const { title, url, techs=[] } = req.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }
  
  repositories[repositoryIndex] = repository;
  
  return res.json(repository);
  
});

app.delete("/repositories/:id", validateRepositoryId, (req, res) => {
  const { id } = req.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.'})
  }
  
  repositories.splice(repositoryIndex, 1);
  
  return res.status(204).send();
  
});

app.post("/repositories/:id/like", validateRepositoryId, (req, res) => {
  const { id } = req.params;
  const addLike = 1;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.'})
  }
  
  const repository = {
    id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes + addLike
  }
  
  repositories[repositoryIndex] = repository;
  
  return res.json(repository);
  
});

module.exports = app;
