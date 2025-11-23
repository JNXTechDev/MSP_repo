# Meta Sender Protect (MSP) - Deployment Guide

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## Deployment on Render

### Prerequisites
- GitHub account with your repository pushed
- Render account (render.com)
- Model files in `backend/models/`:
  - `baseline_pipeline.pkl`
  - `enhanced_pipeline.pkl`
- Metrics file in `backend/experiments_out/`:
  - `verified_metrics.json`

### Deployment Steps

#### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

#### 2. Create Render Services

**Backend Service:**
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Settings:
   - **Name:** `msp-backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt` (in backend directory)
   - **Start Command:** `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
4. Deploy

**Frontend Service:**
1. Go to Render Dashboard → New → Static Site
2. Connect same GitHub repository
3. Settings:
   - **Name:** `msp-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`
4. Add Environment Variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://msp-backend.onrender.com` (replace with your backend URL)
5. Deploy

#### 3. Connect Frontend to Backend
After both services deploy:
1. Get your backend URL from Render (e.g., `https://msp-backend.onrender.com`)
2. Update frontend environment variable with this URL
3. Frontend will automatically use it

### Model Files Note
The `.pkl` model files are excluded from git (see `.gitignore`). You have two options:

**Option A: Upload to Render after deployment**
```bash
# After backend deploys, manually upload model files via Render dashboard
# Files → Add file → Upload baseline_pipeline.pkl and enhanced_pipeline.pkl
```

**Option B: Use Render's "Deploy Hooks"**
- Store model files elsewhere (Google Drive, AWS S3, etc.)
- Use startup scripts to download them during app initialization

### Monitoring

After deployment:
1. Check backend logs: Render Dashboard → msp-backend → Logs
2. Check frontend logs: Render Dashboard → msp-frontend → Build & Deployments
3. Test API: Visit `https://msp-backend.onrender.com/api/health`
4. Test Frontend: Visit `https://msp-frontend.onrender.com`

### Environment Variables

Add these to your Render services:

**Backend:**
- None required (uses defaults)

**Frontend:**
- `REACT_APP_API_URL`: Backend API URL (e.g., `https://msp-backend.onrender.com`)

### Troubleshooting

**"Module not found" errors:**
- Check `requirements.txt` is correct
- Ensure Python version is 3.8+

**CORS errors:**
- Backend has CORS enabled in `app.py`
- Frontend is using correct `REACT_APP_API_URL`

**Model files not found:**
- Upload model files to Render after deployment
- Ensure files are in correct directories

**Frontend not connecting to backend:**
- Verify `REACT_APP_API_URL` environment variable is set
- Check backend service is running

### Production Checklist

- [ ] Git repository pushed
- [ ] `.gitignore` configured
- [ ] `requirements.txt` has all dependencies
- [ ] `Procfile` configured correctly
- [ ] Model files uploaded to Render
- [ ] Environment variables set on Render
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] `REACT_APP_API_URL` updated in frontend
- [ ] Test API endpoints working
- [ ] Test frontend UI working

### Support
For issues with Render deployment, see: https://render.com/docs
