# AI Text Summarizer v2.0

An enhanced version of the original Text Summarizer, now with a modern UI and powered by Google's Gemini AI. This project demonstrates the evolution from a basic summarizer to a feature-rich application with advanced customization options.

## 🚀 What's New in v2.0

- Modern UI with Tailwind CSS and Radix UI
- Upgraded to Google Gemini AI for better summaries
- Multiple summarization styles (Concise, Detailed, Bullet Points)
- Customizable output preferences
- FastAPI backend for improved performance
- Dark Theamed 
- Real-time character validation
- Copy to clipboard functionality
- Toast notifications for better UX


## 🛠️ Available Features

### Summarization Styles
- **Concise**: 2-4 sentences, perfect for quick overview
- **Detailed**: 5-12 sentences, comprehensive analysis
- **Bullet Points**: 3-10 points, key information extraction

### Customization Options
- Adjustable summary length
- Input validation (50-5000 characters)
- Multiple output styles
- Copy to clipboard
- Real-time character counting

## 📱 Screenshots

<div style="display: flex; gap: 20px; justify-content: center; align-items: flex-start;">
  <div style="text-align: center;">
    <p><strong>Base</strong></p>
    <img src="https://github.com/user-attachments/assets/f1be032c-9688-43c0-8ff1-ea290b89323e" width="500" style="border: 2px solid #ccc; border-radius: 8px;"/>
  </div>
  <div style="text-align: center;">
    <p><strong>Generating Summary</strong></p>
    <img src="https://github.com/user-attachments/assets/9d2f544b-c970-4278-9ff7-151325f18ae6" width="500" style="border: 2px solid #ccc; border-radius: 8px;"/>
  </div>
</div>




## 🔨 Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Shadcn UI Components
- Axios
- React Markdown
- Sonner (Toast notifications)

### Backend
- FastAPI
- Google Generative AI (Gemini-1.5)
- Pydantic
- Python-dotenv



## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/imDhiraj/Text-Summarizer-v2.git
cd Text-Summarizer-v2
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
# For Windows
.\venv\Scripts\activate
# For Unix/MacOS
source venv/bin/activate

pip install -r requirements.txt
```

3. **Create .env file in backend directory**
```env
GEMINI_API_KEY=your_api_key_here
```

4. **Frontend Setup**
```bash
cd frontend
npm install
```

## 🚀 Running the Application

1. **Start the Backend**
```bash
cd backend
```
If you're running the project for the first time, you need to create a virtual environment with this CMD
```bash
python -m venv venv
```
```bash
.\venv\Scripts\activate
uvicorn src.main:app --reload --port 8080
```

2. **Start the Frontend**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 🔄 Previous Version

The original version can be found at: [Text-Summarizer v1](https://github.com/imDhiraj/Text-Summarizer)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Google Gemini AI
- Shadcn UI components
- React and FastAPI communities
