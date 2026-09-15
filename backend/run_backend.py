# backend/run_backend.py
import uvicorn
import sys
import os

if __name__ == "__main__":
    # Ensure current directory is on python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    print("Starting Krishna Accessories Python FastAPI Backend on http://127.0.0.1:8000...")
    print("API Documentation available at http://127.0.0.1:8000/docs")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, app_dir=current_dir)

