# Krishna Accessories Backend

FastAPI service for the Krishna Accessories frontend and admin dashboard.

## Run locally

```powershell
cd backend
python -m pip install -r requirements.txt
python run_backend.py
```

The API runs at `http://127.0.0.1:8000` and its documentation is available at `/docs`.

The frontend reads the API base URL from `VITE_API_URL`. When it is not set, it uses `http://127.0.0.1:8000/api`.