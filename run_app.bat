@echo off
call .\myapp_env\Scripts\activate
echo %PATH%
.\myapp_env\Scripts\python.exe app.py
pause
