# TaskNova Backend

This is a Flask-based backend for the TaskNova application. It uses SQLite for storage and provides a REST API for task management.

## Setup

1. **Install Python**: Make sure you have Python 3.x installed.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Server**:
   ```bash
   python main.py
   ```
   The server will run on `http://127.0.0.1:5000`.

## API Endpoints

- `GET /api/tasks`: Fetch all tasks.
- `POST /api/tasks`: Add a new task.
- `PUT /api/tasks/<id>`: Update a task (e.g., mark as completed).
- `DELETE /api/tasks/<id>`: Delete a task.
