<h1 align="center">
  <br>
  <img src="./frontend/public/logo.svg" alt="Akki" width="100">
  <br>
  Akki
  <br>
</h1>

<h4 align="center">Minimal note-taking app with markdown support</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#see-it-in-action">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#development">Development</a> •
  <a href="#acknowledgements">Acknowledgements</a> •
</p>

## Key Features

- WYSIWYG editor with markdown shortcuts
- Syntax highlighting
- Dark/Light mode
- Synchronization backend
- Powerful full-text search

## See It In Action

A demo instance is available here - [Akki Demo](https://akki-demo.tinmyintkyaw.com)

## Installation

Docker is the recommended way to install Akki. An example `docker-compose.yml` is provided.

## Roadmap

- Import/export in multiple formats
- File attatchments
- Offline editing
- Multi-user collaborative Editing

## Development

### Prerequisites

- Node.js
- Docker & Docker Compose
- pnpm

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/tinmyintkyaw/akki

# Go into the repository
$ cd akki

# Install dependencies
$ pnpm -r install --frozen-lockfile
```

Create an .env file with the required values in `./backend`. See `.env.example` for all the options

```bash
$ cp backend/.env.example backend/.env.development
```

Although optional, `devcontainers` are highly recommended for bootstrapping required services. If not using `devcontainers`, you must set up the services manually, please refer to the `.devcontainer/docker-compose.yml` for reference.

```bash
# Run the app
$ pnpm run dev
```

## Acknowledgements

This project would not be possible without the following awesome open source projects:

- [PostgreSQL](https://www.postgresql.org/)
- [Vite](https://vite.dev)
- [React](https://react.dev)
- [Express.js](https://github.com/expressjs/express)
- [Meilisearch](https://www.meilisearch.com/)
- [Tiptap](https://tiptap.dev/)
- [better-auth](https://github.com/better-auth/better-auth)
- [Y.js](https://github.com/yjs/yjs)
