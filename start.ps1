# Start backend server
Start-Process -NoNewWindow powershell -ArgumentList "cd backend; uvicorn main:app --reload"

# Start frontend server
Start-Process -NoNewWindow powershell -ArgumentList "cd frontend; npm run dev"

Write-Host "Servers started! Access the app at http://localhost:5173" 