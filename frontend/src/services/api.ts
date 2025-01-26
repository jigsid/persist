import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface MusicVideoResponse {
  status: string;
  video_url: string;
  tempo: number;
  num_beats: number;
}

export interface TikTokVideoResponse {
  video_url: string;
  script: string;
}

export const generateMusicVideo = async (
  file: File,
  theme: string,
  effects: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("theme", theme);
  formData.append("effects", effects);

  const response = await api.post<MusicVideoResponse>(
    "/upload-song",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export interface TikTokGenerationRequest {
  prompt: string;
  text_position: string;
  voice_style: string;
  visual_style: string;
}

export const generateTikTokVideo = async (data: TikTokGenerationRequest) => {
  const response = await api.post<TikTokVideoResponse>(
    "/generate-tiktok",
    data
  );
  return response.data;
};
