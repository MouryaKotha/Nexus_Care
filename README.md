# Nexus Care - Excellence in Healthcare

Nexus Care is a modern healthcare platform designed to provide a seamless experience for patients and healthcare professionals. The platform includes AI-powered symptom checking, doctor consultations (via Google Meet, Skype, or Audio), medical document simplification (MediTranslate), and appointment management.

## Features

- **AI Symptom Checker**: Describe symptoms and get automated medical insights.
- **Online Telemedicine**: Book consultations with specialists and connect via Google Meet or Skype.
- **MediTranslate**: Simplify complex medical jargon into plain language.
- **AI Mentor**: Supportive AI assistant for health-related guidance.
- **Doctor Profiles**: Detailed information about specialists, including education, certifications, and availability.
- **Emergency Services One-Touch Dialer**: Quick access to emergency contacts.
- **Reminder System**: Track medications and health tasks.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI**: Google Gemini AI (via API).

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Google Gemini API Key.
- A MongoDB URI (if you wish to enable appointment storage).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nexus-care.git
   cd nexus-care
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Use `.env.example` as a template.
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=your_mongodb_uri_here
   PORT=5000
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

2. **Open the Frontend**:
   Simply open `index.html` in your browser. (Alternatively, you can use a Live Server extension in VS Code).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for demonstration purposes and uses AI for informational health analysis. It is not a substitute for professional medical advice, diagnosis, or treatment.
