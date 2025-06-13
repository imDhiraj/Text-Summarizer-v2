# backend/src/utils/summarizer.py

import os
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# Load environment variables
load_dotenv()

# --- Pydantic Models for data structure ---

class UserPreferences(BaseModel):
    tone: Optional[str] = Field("neutral", description="Tone of summary: neutral, formal, casual, technical")
    focus: Optional[str] = Field("main_points", description="Focus area: main_points, details, conclusions, key_facts")
    audience: Optional[str] = Field("general", description="Target audience: general, technical, academic, business")

class SummaryRequest(BaseModel):
    text: str = Field(..., min_length=50, max_length=5000, description="Text to be summarized")
    max_sentences: Optional[int] = Field(3, ge=1, le=20, description="Maximum sentences in summary")
    style: Optional[str] = Field("concise", description="Summary style: concise, detailed, or bullet_points")
    preferences: Optional[UserPreferences] = Field(default_factory=UserPreferences, description="User preferences for customization")

class SummaryResponse(BaseModel):
    summary: str
    status: str = "success"
    original_length: int
    summary_length: int
    applied_preferences: Dict[str, Any]

# --- Core Summarization Function ---

def initialize_gemini():
    """Initialize Gemini AI model"""
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("Error: GEMINI_API_KEY not found in environment variables")
            return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        return model
    except Exception as e:
        print(f"Error initializing Gemini: {e}")
        return None

def summarize_text_with_preferences(
    text: str, 
    max_sentences: int, 
    style: str,
    preferences: UserPreferences
) -> str:
    """Enhanced summarization with user preferences"""
    
    model = initialize_gemini()
    if not model:
        return "Error: Failed to initialize Gemini model."
    
    if not text or not text.strip():
        return "Error: No text provided for summarization."
    
    base_prompts = {
        "concise": f"Provide a concise summary in no more than {max_sentences} sentences:",
        "detailed": f"Provide a comprehensive summary in no more than {max_sentences} sentences, including key points and important details:",
        "bullet_points": f"Summarize as {max_sentences} key bullet points:"
    }
    
    tone_modifiers = {
        "neutral": "", "formal": " Use formal language.", "casual": " Use casual language.", "technical": " Use technical terminology."
    }
    
    focus_modifiers = {
        "main_points": " Focus on the main points.", "details": " Include supporting details.", "conclusions": " Emphasize conclusions.", "key_facts": " Highlight key facts."
    }
    
    audience_modifiers = {
        "general": "", "technical": " Write for a technical audience.", "academic": " Use an academic writing style.", "business": " Write for a business audience."
    }
    
    base_prompt = base_prompts.get(style, base_prompts["concise"])
    
    tone_mod = tone_modifiers.get(preferences.tone, "")
    focus_mod = focus_modifiers.get(preferences.focus, "")
    audience_mod = audience_modifiers.get(preferences.audience, "")
        
    enhanced_prompt = f"{base_prompt}{tone_mod}{focus_mod}{audience_mod}"
    full_prompt = f"{enhanced_prompt}\n\nText to summarize:\n{text}"
    
    try:
        response = model.generate_content(
            full_prompt,
            generation_config={"temperature": 0.3, "max_output_tokens": 500}
        )
        return response.text.strip() if response.text else "Error: Empty response from Gemini API."
            
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"Error generating summary: {str(e)}"