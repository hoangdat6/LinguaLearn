# LinguaLearn - English Vocabulary Learning Application

A comprehensive learning platform for English vocabulary with interactive lessons, smart review system, and progress tracking.

## Project Overview

LinguaLearn is a full-stack application designed to help users learn and practice English vocabulary effectively. The application provides structured lessons across different proficiency levels, personalized review sessions, progress tracking, and a built-in dictionary.

## Features

- **Interactive Lessons**: Various types including vocabulary, conversation, listening, writing, and speaking
- **Smart Review System**: Optimized spaced repetition algorithm for better retention
- **Progress Tracking**: Detailed statistics and visualization of learning progress
- **Dictionary**: Integrated lookup tool for quick reference
- **User Management**: Authentication, profiles, and personalized learning paths
- **Admin Dashboard**: Comprehensive analytics and content management system
- **Dark/Light Mode**: Customizable interface for better user experience

## Technology Stack

### Frontend
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Radix UI
- **Animation**: Framer Motion
- **State Management**: React Hooks

### Backend
- **Framework**: Django/Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django authentication system
- **API Documentation**: OpenAPI/Swagger
- **Containerization**: Docker

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Python 3.10+
- PostgreSQL
- Docker & Docker Compose (optional)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd vocab-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start development server:
```bash
npm run dev
# or
yarn dev
```

4. Access the application at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure the database in `.env` file (create if needed):
```
DB_NAME=yourdatabasename
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_HOST=localhost
SECRET_KEY=yoursecretkey
DEBUG=True
```

5. Apply migrations:
```bash
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

8. Access the API at `http://localhost:8000/api/`
9. Access the admin interface at `http://localhost:8000/admin/`

## User Interface & Core Functionality

### Main User Interface

#### Home Dashboard
- **Progress Overview**: Visual representation of vocabulary mastery levels
- **Daily Goals**: Track daily learning targets and streaks
- **Recommended Lessons**: Personalized suggestions based on user progress

#### Vocabulary Learning
- **Topic-Based Lists**: Vocabulary organized by themes and difficulty levels
- **Interactive Cards**: Flip cards showing word, pronunciation, meaning, and examples
- **Audio Pronunciation**: Native speaker recordings of each vocabulary item

#### Review System
- **Smart Review**: Algorithm prioritizes words based on learning status
- **Multiple Choice Questions**: Test comprehension with various question types
- **Writing Practice**: Type answers to reinforce spelling and recall
- **Review Results**: Detailed performance statistics after each session

#### Dictionary
- **Search Functionality**: Quick lookup for any English word
- **Detailed Entries**: Definitions, examples, synonyms, and antonyms
- **Save to Collection**: Add useful words to personal vocabulary lists

### Admin Interface

#### Dashboard
- **User Statistics**: Active users, new registrations, and engagement metrics
- **Learning Analytics**: Most studied topics and completion rates
- **System Performance**: Server status and application metrics

#### Content Management
- **Lesson Editor**: Create and modify learning materials and vocabulary lists
- **Question Bank**: Manage review questions and difficulty settings
- **Media Library**: Upload and organize images and audio files

#### User Management
- **User Profiles**: View and edit user information and learning progress
- **Role Assignment**: Set permissions for different user types
- **Activity Logs**: Monitor user engagement and system usage

### Mobile Responsiveness
The application is fully responsive, providing an optimal experience across desktop, tablet, and mobile devices with adaptive layouts and touch-friendly controls.

## Project Structure

## Docker Setup (Optional)

1. Build the Docker images:
```bash
docker-compose build
```

2. Start the containers:
```bash
docker-compose up
```

3. Access the application at `http://localhost:8000`

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact us at support@lingualearn.com.

