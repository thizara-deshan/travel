@echo off
echo Generating self-signed SSL certificate for development...

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo OpenSSL is not installed or not in PATH.
    echo Please install OpenSSL or use the Docker method below:
    echo.
    echo Docker method:
    echo docker run --rm -v "%CD%:/certs" alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /certs/privkey.pem -out /certs/fullchain.pem -subj "/C=US/ST=Development/L=Local/O=BitTravel/CN=thizara.dev"
    echo.
    pause
    exit /b 1
)

openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
    -keyout privkey.pem ^
    -out fullchain.pem ^
    -subj "/C=US/ST=Development/L=Local/O=BitTravel/CN=thizara.dev"

echo.
echo Self-signed SSL certificate generated successfully!
echo Files created:
echo - fullchain.pem
echo - privkey.pem
echo.
echo Note: This is a self-signed certificate for development only.
echo Browsers will show security warnings.
echo.
pause
