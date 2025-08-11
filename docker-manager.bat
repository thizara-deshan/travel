@echo off
setlocal EnableDelayedExpansion

REM BitTravel Docker Management Script for Windows

set "command=%~1"
set "service=%~2"

if "%command%"=="" set "command=help"

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed or not in PATH
    exit /b 1
)

goto %command% 2>nul || goto unknown_command

:setup
echo [INFO] Setting up environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo [SUCCESS] Created backend\.env from example
    echo [WARNING] Please update backend\.env with your configuration, especially JWT_SECRET
)
if not exist "frontend\.env" (
    copy "frontend\.env.example" "frontend\.env" >nul
    echo [SUCCESS] Created frontend\.env from example
)
goto :eof

:build
call :setup
echo [INFO] Building and starting services in production mode...
docker-compose up --build
goto :eof

:build-dev
call :setup
echo [INFO] Building and starting services in development mode...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
goto :eof

:start
echo [INFO] Starting services in production mode...
docker-compose up -d
echo [SUCCESS] Services started successfully!
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend: http://localhost:5000
echo [INFO] Health Check: http://localhost:5000/health
goto :eof

:start-dev
echo [INFO] Starting services in development mode...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
echo [SUCCESS] Services started successfully!
echo [INFO] Frontend: http://localhost:3000
echo [INFO] Backend: http://localhost:5000
echo [INFO] Health Check: http://localhost:5000/health
goto :eof

:stop
echo [INFO] Stopping services...
docker-compose down
echo [SUCCESS] Services stopped successfully!
goto :eof

:restart
echo [INFO] Restarting services...
docker-compose restart
echo [SUCCESS] Services restarted successfully!
goto :eof

:logs
if "%service%"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %service%
)
goto :eof

:status
echo [INFO] Service Status:
docker-compose ps
goto :eof

:cleanup
echo [WARNING] This will remove all containers, networks, and images. Data volumes will be preserved.
set /p "confirm=Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    docker-compose down --rmi all
    echo [SUCCESS] Cleanup completed!
) else (
    echo [INFO] Cleanup cancelled.
)
goto :eof

:reset-db
echo [WARNING] This will DELETE ALL DATABASE DATA!
set /p "confirm=Are you sure? (y/N): "
if /i "!confirm!"=="y" (
    docker-compose down
    docker volume rm bittravel_postgres_data 2>nul
    echo [SUCCESS] Database reset completed!
    echo [INFO] Run 'start' command to recreate the database
) else (
    echo [INFO] Database reset cancelled.
)
goto :eof

:help
echo BitTravel Docker Management Script for Windows
echo.
echo Usage: %~nx0 [command] [options]
echo.
echo Commands:
echo   setup          Set up environment files
echo   build          Build and start services (production mode)
echo   build-dev      Build and start services (development mode)
echo   start          Start services (production mode)
echo   start-dev      Start services (development mode)
echo   stop           Stop all services
echo   restart        Restart all services
echo   logs [service] View logs for all services or specific service
echo   status         Show service status
echo   cleanup        Remove containers and images (keeps data)
echo   reset-db       Reset database (DESTROYS ALL DATA)
echo   help           Show this help message
echo.
echo Examples:
echo   %~nx0 setup              # Set up environment files
echo   %~nx0 build-dev          # Build and start in development mode
echo   %~nx0 logs backend       # View backend logs
echo   %~nx0 logs               # View all logs
goto :eof

:unknown_command
echo [ERROR] Unknown command: %command%
echo.
goto help
