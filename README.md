# Video Generation Studio

A powerful video generation platform with two main features:

1. Music Video Background Generator - Create synchronized video backgrounds for music tracks
2. TikTok-Style Video Generator - Generate portrait mode videos with AI-generated scripts and visuals

## Features

### Music Video Generator

- Upload songs or pull from platforms like SoundMeme
- Choose visual themes (realistic, animated, abstract, nature)
- Beat synchronization
- Effect customization
- Preview generation
- Download/Share options

### TikTok Video Generator

- Text-to-video generation
- AI script generation
- Portrait mode optimization
- Text overlay customization
- Voice synthesis (optional)
- Multiple visual styles
- Preview and customization options

## Tech Stack

### Backend

- Python with FastAPI
- Video Generation: Replicate API (Stable Video Diffusion)
- Audio Processing: librosa
- Beat Detection: librosa
- Script Generation: Llama 2
- Voice Synthesis: Eleven Labs (optional)

### Frontend

- React with TypeScript
- Chakra UI for styling
- Axios for API calls
- Vite for development

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd video-generation-studio
```

2. Set up backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
# Backend
cp .env.example .env
# Add your Replicate API key to .env
```

4. Set up frontend:

```bash
cd frontend
npm install
```

5. Start the development servers:

```bash
# Start both servers using PowerShell
.\start.ps1

# Or start them separately:
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

6. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

### Music Video Generator

- `POST /upload-song` - Generate video background for music
  - Parameters:
    - `file`: Audio file
    - `theme`: Visual theme
    - `effects`: Effect settings

### TikTok Video Generator

- `POST /generate-tiktok` - Generate TikTok-style video
  - Parameters:
    - `prompt`: Video idea/description
    - `text_position`: Text overlay position
    - `voice_style`: Voice style for synthesis
    - `visual_style`: Visual style for generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
