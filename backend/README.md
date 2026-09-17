# Krishna Accessories Backend (PostgreSQL + FastAPI)

Python FastAPI REST backend connected directly to **PostgreSQL Database** (`krishna_db`).

---

## 1. Environment & Database Setup

The backend connects to PostgreSQL using credentials configured in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:vrushali@localhost:5432/krishna_db
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=vrushali
PGDATABASE=krishna_db
```

---

## 2. Install Dependencies & Run

```powershell
# Navigate to backend directory
cd backend

# Install Python requirements (FastAPI, Uvicorn, psycopg2-binary, python-dotenv)
python -m pip install -r requirements.txt

# Run the backend server
python run_backend.py
```

- API Server: `http://127.0.0.1:8000`
- Interactive API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

---

## 3. Database Tools & Utilities

### Test PostgreSQL Connection
```powershell
python test_db_connection.py
```
Verifies connection, lists all 21 tables, and checks row counts.

### Migrate Data from SQLite or Re-initialize
```powershell
python migrate_to_postgres.py
```
Copies all data from SQLite `krishna.db` into PostgreSQL `krishna_db` and syncs ID sequences.

### Seed Default Fixtures
```powershell
python seed_data.py
```
Seeds initial catalog fixtures, brands, categories, and demo admin/supplier accounts.

---

## Gujarati Guide (ગુજરાતી માર્ગદર્શિકા)

1. **ડેટાબેઝ સેટઅપ:** PostgreSQL માં `krishna_db` ડેટાબેઝ ઓટોમેટિક બની ગયો છે અને તમામ 21 ટેબલ્સ કનેક્ટ થઈ ગયા છે.
2. **કનેક્શન ટેસ્ટ કરવા માટે:** `python test_db_connection.py` રન કરો.
3. **બેકએન્ડ ચલાવવા માટે:** `python run_backend.py` અથવા `run.bat` ડબલ ક્લિક કરો.
4. **ડેટા સેવિંગ:** હવે વેબસાઈટ પર થતી તમામ ક્રિયાઓ (પ્રોડક્ટ્સ, ઓર્ડર્સ, યુઝર્સ, કાર્ટ, વગેરે) સીધા PostgreSQL ડેટાબેઝમાં સ્ટોર થશે.