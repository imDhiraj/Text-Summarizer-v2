# backend/src/routes/api.py

from fastapi import APIRouter, HTTPException
# Correctly import models and function from your utils file
from src.utilts.summarizer import (
    summarize_text_with_preferences,
    SummaryRequest, 
    SummaryResponse
)

# Fix the import typo: 'utilts' -> 'utils'

router = APIRouter()

@router.post("/summarize", response_model=SummaryResponse)
def summarize(request: SummaryRequest):
    """
    Summarize text using Gemini AI with user preferences.
    This endpoint now correctly uses the imported SummaryRequest model,
    which includes the 'preferences' field.
    """
    try:
        # Call the summarizer function with all the required arguments from the request
        summary_text = summarize_text_with_preferences(
            text=request.text,
            max_sentences=request.max_sentences,
            style=request.style,
            preferences=request.preferences  # Pass the entire preferences object
        )
        
        if summary_text.startswith("Error:"):
            raise HTTPException(status_code=500, detail=summary_text)
            
        return SummaryResponse(
            summary=summary_text,
            original_length=len(request.text),
            summary_length=len(summary_text),
            applied_preferences={
                "style": request.style,
                "max_sentences": request.max_sentences,
                "tone": request.preferences.tone,
                "focus": request.preferences.focus,
                "audience": request.preferences.audience
            }
        )
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")