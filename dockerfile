# ------------ FRONTEND ------------
    FROM node:18 AS frontend

    WORKDIR /app
    
    # Copy frontend-related files
    COPY package*.json ./
    COPY vite.config.* ./
    COPY tailwind.config.js postcss.config.js ./
    COPY index.html ./
    COPY src ./src
    
    # Install dependencies and build
    RUN npm install
    RUN npm run build
    
    
    # ------------ BACKEND ------------
    FROM python:3.11-slim AS backend
    
    WORKDIR /app
    
    # Install Python dependencies
    COPY requirements.txt ./
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy backend code
    COPY api ./api
    
    # Copy frontend build from previous stage into backend container
    COPY --from=frontend /app/dist ./frontend
 
    
    # Environment variable for FastAPI port
    ENV PORT=8000
    
    # Expose port (optional, for local runs)
    EXPOSE 8000
    
    # Run FastAPI app using Uvicorn
    CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
    