from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import replicate
import librosa
import numpy as np
from dotenv import load_dotenv
from typing import Optional, Dict
import tempfile
import soundfile as sf
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Video Generator")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TikTokRequest(BaseModel):
    prompt: str
    text_position: str
    voice_style: str
    visual_style: str

@app.get("/")
async def root():
    return {"message": "Video Generator API"}

@app.post("/upload-song")
async def upload_song(
    file: UploadFile = File(...),
    theme: str = Form(...),
    effects: str = Form("default")
):
    try:
        # Create temp file to store uploaded audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(await file.read())
            temp_audio_path = temp_audio.name

        # Load audio file and analyze beats
        y, sr = librosa.load(temp_audio_path)
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        beat_times = librosa.frames_to_time(beat_frames, sr=sr)

        # Generate prompts based on beats and theme
        prompts = generate_prompts(beat_times, theme)

        # Use Replicate API to generate video
        video_output = await generate_video(prompts, effects)

        # Clean up temp file
        os.unlink(temp_audio_path)

        return JSONResponse({
            "status": "success",
            "video_url": video_output,
            "tempo": tempo,
            "num_beats": len(beat_times)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-tiktok")
async def generate_tiktok(request: TikTokRequest):
    try:
        # Generate script using AI
        script = await generate_script(request.prompt)
        
        # Generate video using Replicate
        video_url = await generate_tiktok_video(
            script,
            request.visual_style,
            request.text_position
        )
        
        # Generate voiceover if requested
        if request.voice_style != "none":
            audio_url = await generate_voiceover(script, request.voice_style)
            # TODO: Merge audio with video
        
        return {
            "video_url": video_url,
            "script": script
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_script(prompt: str) -> str:
    """Generate a script for the TikTok video using AI"""
    try:
        # Use Replicate's Llama model for script generation
        model = replicate.Client(api_token=os.getenv("REPLICATE_API_KEY"))
        output = model.run(
            "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
            input={
                "prompt": f"Write a short, engaging TikTok script about: {prompt}. Keep it under 60 seconds.",
                "max_length": 500,
            }
        )
        return output[0] if output else ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Script generation failed: {str(e)}")

async def generate_tiktok_video(script: str, style: str, text_position: str) -> str:
    """Generate a TikTok-style video using Replicate"""
    try:
        model = replicate.Client(api_token=os.getenv("REPLICATE_API_KEY"))
        
        # Use Stable Video Diffusion for video generation
        output = model.run(
            "stability-ai/stable-video-diffusion:3d4c3c5ecf5b1c27243b5f2f8d7b4c8a7c66a8b2",
            input={
                "prompt": script,
                "video_length": "4",
                "fps": 24,
                "width": 1080,
                "height": 1920,  # Portrait mode for TikTok
            }
        )
        
        return output[0] if output else None

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")

async def generate_voiceover(script: str, style: str) -> str:
    """Generate voiceover using Eleven Labs API"""
    try:
        # TODO: Implement Eleven Labs API integration
        return ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voiceover generation failed: {str(e)}")

def generate_prompts(beat_times, theme):
    """Generate video prompts based on beat timing and theme"""
    base_prompts = {
        "realistic": "cinematic, photorealistic, high quality",
        "animated": "animated, cartoon style, vibrant colors",
        "abstract": "abstract art, flowing shapes, colorful patterns",
        "nature": "natural landscapes, flowing water, trees",
    }

    base_prompt = base_prompts.get(theme, base_prompts["abstract"])
    prompts = []
    
    for i, beat in enumerate(beat_times):
        # Vary prompts based on beat position
        if i % 4 == 0:  # Every 4th beat
            prompts.append(f"{base_prompt}, intense movement")
        else:
            prompts.append(f"{base_prompt}, subtle movement")
    
    return prompts

async def generate_video(prompts, effects):
    """Generate video using Replicate API"""
    try:
        # Initialize Replicate client
        model = replicate.Client(api_token=os.getenv("REPLICATE_API_KEY"))
        
        # Use Stable Video Diffusion model
        output = model.run(
            "stability-ai/stable-video-diffusion:3d4c3c5ecf5b1c27243b5f2f8d7b4c8a7c66a8b2",
            input={
                "prompt": prompts[0],  # Start with first prompt
                "video_length": "4",  # seconds
                "fps": 24,
            }
        )
        
        return output[0] if output else None

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 