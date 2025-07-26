# Contributing to MDCAT Prep Web App

Thank you for considering contributing to the MDCAT Prep Web App! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the best possible outcome for the project
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the bug
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed and why it's a problem
- Include screenshots if applicable
- Note your operating system, browser, and relevant environment details

### Suggesting Enhancements

Enhancement suggestions are also tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed enhancement
- Explain why this enhancement would be useful to most users
- List any relevant examples or references

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines

- Update the README.md with details of changes if applicable
- Update the documentation if needed
- The PR should work on the main development branch
- Include tests for new features
- Follow the existing code style
- Keep PRs focused on a single concern

## Development Setup

### Backend Development

```bash
cd backend
pip install -r requirements.txt
pip install -e .
pip install pytest black isort
uvicorn main:app --reload
```

### Frontend Development

```bash
cd frontend/mdcat-frontend
npm install
npm run dev
```

### Running Tests

#### Backend Tests

```bash
cd backend
python -m pytest
```

#### Frontend Tests

```bash
cd frontend/mdcat-frontend
npm test
```

### Code Style

#### Backend

We use Black and isort for Python code formatting:

```bash
cd backend
black .
isort .
```

#### Frontend

We use ESLint and Prettier for JavaScript/React code formatting:

```bash
cd frontend/mdcat-frontend
npm run lint
npm run format
```

## Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch for integrating features
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `release/*`: Release preparation branches

## Commit Message Guidelines

We follow conventional commits for clear communication:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(auth): add JWT authentication`

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.