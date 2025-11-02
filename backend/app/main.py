from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, users, programs, scholarships, applications, chat

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_PREFIX}/users", tags=["Users"])
app.include_router(programs.router, prefix=f"{settings.API_V1_PREFIX}/programs", tags=["Programs"])
app.include_router(scholarships.router, prefix=f"{settings.API_V1_PREFIX}/scholarships", tags=["Scholarships"])
app.include_router(applications.router, prefix=f"{settings.API_V1_PREFIX}/applications", tags=["Applications"])
app.include_router(chat.router, prefix=f"{settings.API_V1_PREFIX}/chat", tags=["Chat"])


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to Masters Abroad Platform API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
