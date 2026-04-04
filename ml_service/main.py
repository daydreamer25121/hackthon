import numpy as np
from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
import requests
import json as _json

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_average_rgb(image_bytes: bytes):
    """
    Get the average RGB from the center 30% of the image.
    This assumes the user has centered their face in the frame.
    """
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    width, height = img.size
    
    # Define center crop (30% area)
    left = width * 0.35
    top = height * 0.35
    right = width * 0.65
    bottom = height * 0.65
    
    img_cropped = img.crop((left, top, right, bottom))
    
    # Calculate average RGB
    img_array = np.array(img_cropped)
    avg_rgb = np.mean(img_array, axis=(0, 1))
    
    return [float(c) for c in avg_rgb]

@app.post("/extract-skin-tone")
async def extract_skin_tone_api(file: UploadFile = File(...)):
    """
    Estimate skin tone bucket from an image file using lightness-based logic.
    """
    contents = await file.read()
    try:
        rgb = get_average_rgb(contents)
    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}

    r, g, b = rgb
    
    # User's effective lightness-based logic
    # Convert to simple lightness measure.
    lightness = (max(r, g, b) + min(r, g, b)) / 2.0 / 255.0

    if lightness >= 0.70:
        tone = "Fair"
        recommendations = [
            {"name": "Cherry Red", "hex": "#D2042D"},
            {"name": "Royal Blue", "hex": "#4169E1"},
            {"name": "Emerald Green", "hex": "#50C878"},
            {"name": "Soft Pink", "hex": "#FFB6C1"}
        ]
    elif lightness >= 0.50:
        tone = "Wheatish"
        recommendations = [
            {"name": "Olive Green", "hex": "#808000"},
            {"name": "Warm Gold", "hex": "#D4AF37"},
            {"name": "Terracotta", "hex": "#E2725B"},
            {"name": "Teal", "hex": "#008080"}
        ]
    elif lightness >= 0.30:
        tone = "Medium Brown"
        recommendations = [
            {"name": "Eggplant Purple", "hex": "#614051"},
            {"name": "Forest Green", "hex": "#228B22"},
            {"name": "Navy Blue", "hex": "#000080"},
            {"name": "Ruby Red", "hex": "#E0115F"}
        ]
    else:
        tone = "Dark Brown"
        recommendations = [
            {"name": "Bright Yellow", "hex": "#FFEF00"},
            {"name": "Magenta", "hex": "#FF00FF"},
            {"name": "White Pearl", "hex": "#F0EAD6"},
            {"name": "Cyan", "hex": "#00FFFF"}
        ]

    confidence = 0.6 + abs(lightness - 0.5) * 0.4
    
    return {
        "hex": '#{:02x}{:02x}{:02x}'.format(int(r), int(g), int(b)),
        "palette": tone,
        "confidence": float(round(confidence, 2)),
        "recommendations": recommendations,
        "rgb_sample": rgb
    }

@app.post("/outfit-suggest")
async def outfit_suggest(payload: dict = Body(...)):
    """
    Occasion-based outfit suggestion with optional skin tone awareness.
    """
    occasion = str(payload.get("occasion") or "Casual")
    notes = str(payload.get("notes") or "").strip()
    skin_tone = str(payload.get("skin_tone") or "").strip()

    system_prompt = (
        "You are ShopSmart's stylist assistant. Suggest a complete outfit from these store categories only: "
        "shirts, pants, shoes, caps, bracelets. Return ONLY JSON with keys: categories (array of categories), "
        "message (short 1-2 sentence suggestion including color tips for the skin tone). Do not mention anything outside shopping."
    )

    # Deterministic fallback (works without external API).
    fallback = {
        "Casual": (["shirts", "pants", "shoes", "caps"], "Casual fit: a relaxed shirt with comfy pants and clean sneakers, finished with a cap."),
        "Formal": (["shirts", "pants", "shoes", "bracelets"], "Formal look: a crisp shirt with tailored pants and polished shoes; add a subtle bracelet."),
        "Wedding": (["shirts", "pants", "shoes", "bracelets"], "Wedding-ready: a premium shirt with dress pants and statement shoes; elevate with a bracelet."),
        "Party": (["shirts", "pants", "shoes", "bracelets"], "Party look: a bold shirt with sleek pants and standout shoes; add a metallic bracelet."),
        "Sports": (["shirts", "pants", "shoes", "caps"], "Sporty vibe: breathable top, flexible pants, running shoes, and a cap for the finish."),
        "Festive": (["shirts", "pants", "shoes", "bracelets"], "Festive style: a rich-toned shirt with sharp pants and clean shoes; accent with a bracelet."),
    }
    categories, msg = fallback.get(occasion, fallback["Casual"])

    # Personalize fallback message with skin tone if provided
    if skin_tone:
        msg += f" This palette complements your {skin_tone} skin tone perfectly."

    claude_key = os.getenv("CLAUDE_API_KEY", "")
    if not claude_key:
        return {"occasion": occasion, "categories": categories, "message": msg}

    # Claude (Anthropic Messages API) - best-effort; fallback on any error.
    try:
        user_prompt = f"Occasion: {occasion}."
        if skin_tone:
            user_prompt += f" Skin Tone: {skin_tone}."
        if notes:
            user_prompt += f" Notes: {notes}."
            
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": claude_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-3-5-sonnet-20240620",
                "max_tokens": 256,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}],
            },
            timeout=20,
        )
        if resp.status_code >= 400:
            return {"occasion": occasion, "categories": categories, "message": msg}

        data = resp.json()
        content_blocks = data.get("content") or []
        text = ""
        for b in content_blocks:
            if b.get("type") == "text":
                text += b.get("text", "")

        parsed = _json.loads(text)
        out_categories = parsed.get("categories") or categories
        out_message = parsed.get("message") or msg

        # Validate categories are within allowed set.
        allowed = {"shirts", "pants", "shoes", "caps", "bracelets"}
        out_categories = [c for c in out_categories if c in allowed]
        if not out_categories:
            out_categories = categories

        return {"occasion": occasion, "categories": out_categories, "message": out_message}
    except Exception:
        return {"occasion": occasion, "categories": categories, "message": msg}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
