# MDCAT Prep Web App

An AI-powered platform for MDCAT exam preparation, providing verified content, AI-generated questions, personalized learning plans, and performance tracking.

## Project Overview

The MDCAT Prep Web App is designed to help students prepare for the Medical and Dental College Admission Test (MDCAT) through a comprehensive, AI-enhanced learning experience. The platform offers verified content, AI-generated practice questions, personalized learning plans, and detailed performance tracking.

### Key Features

- **Verified Content Sources**: Curated study materials from trusted sources
- **AI-Powered Question Generation**: Questions linked directly to source material
- **Student Notes & Bookmarking**: Personalized study organization
- **Timed Learning Plans**: Structured preparation schedules
- **Performance Tracking**: Detailed analytics on progress
- **AI Academic Guidance**: Personalized learning assistant
- **Flexible Mock Tests**: Customizable practice exams
- **Diagnostic Assessment**: Initial evaluation of strengths and weaknesses
- **Community Contributions**: User-contributed study notes with quality control

## Technical Architecture

### Frontend

- React.js with Vite
- React Context API/useState/useReducer for state management
- React Router DOM for routing
- CSS Modules and Tailwind CSS for styling
- axios/fetch for API communication
- react-hook-form for forms
- Chart.js/Recharts for data visualization

### Backend

- FastAPI with Pydantic
- SQLite (initially) / PostgreSQL (future)
- ChromaDB for vector embeddings
- JWT authentication with python-jose and passlib
- LangChain for RAG pipelines
- Groq API (Mixtral 8x7B) as primary LLM
- OpenAI GPT-4 as fallback LLM
- Background tasks for intensive operations
- python-multipart for file handling
- pytesseract or cloud OCR for notes

### DevOps & Deployment

- Docker for containerization
- Docker Compose for local orchestration
- GitHub Actions for CI/CD
- Git & GitHub for version control

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.11+ (for local backend development)
- API keys for Groq and/or OpenAI

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mdcat-prep.git
   cd mdcat-prep
   ```

2. Create a `.env` file in the backend directory:
   ```
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   CHROMA_DB_PATH=./chroma_db
   ```

### Running with Docker Compose

```bash
docker-compose up -d
```

This will start the frontend, backend, and ChromaDB services. The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8000.

### Local Development

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend/mdcat-frontend
npm install
npm run dev
```

## Development Approach

- **Modular Design**: Features are broken down into small, testable modules
- **Test-Driven Development**: Tests are written for critical functionalities
- **API-First Development**: API contracts are defined using Pydantic before frontend implementation
- **Security First**: Secure authentication and best practices are implemented from the start

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.