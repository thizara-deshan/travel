@echo off
echo BitTravel Docker Management Script
echo.

:menu
echo Choose an option:
echo 1. Start Production Environment (with Nginx proxy)
echo 2. Start Development Environment (with hot reloading)
echo 3. Stop All Services
echo 4. View Logs
echo 5. Restart Nginx Only
echo 6. Check Service Status
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto production
if "%choice%"=="2" goto development
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto restart_nginx
if "%choice%"=="6" goto status
if "%choice%"=="7" goto exit
echo Invalid choice. Please try again.
goto menu

:production
echo Starting Production Environment...
docker-compose up -d --build
echo.
echo Production environment started!
echo Access your application at: https://thizara.dev
echo Health check: https://thizara.dev/nginx-health
echo.
goto menu

:development
echo Starting Development Environment...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
echo.
echo Development environment started!
echo Direct frontend access: http://localhost:3000
echo Direct backend access: http://localhost:5000
echo Through Nginx proxy: https://thizara.dev
echo.
goto menu

:stop
echo Stopping all services...
docker-compose down
echo All services stopped.
echo.
goto menu

:logs
echo Choose logs to view:
echo 1. All services
echo 2. Nginx only
echo 3. Frontend only
echo 4. Backend only
echo 5. Database only
set /p log_choice="Enter choice (1-5): "

if "%log_choice%"=="1" docker-compose logs --tail=50 -f
if "%log_choice%"=="2" docker-compose logs --tail=50 -f nginx
if "%log_choice%"=="3" docker-compose logs --tail=50 -f frontend
if "%log_choice%"=="4" docker-compose logs --tail=50 -f backend
if "%log_choice%"=="5" docker-compose logs --tail=50 -f postgres
echo.
goto menu

:restart_nginx
echo Restarting Nginx...
docker-compose restart nginx
echo Nginx restarted.
echo.
goto menu

:status
echo Service Status:
docker-compose ps
echo.
echo Container Health:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
goto menu

:exit
echo Goodbye!
exit /b 0
