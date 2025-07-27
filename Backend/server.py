from flask import Flask, request, jsonify, send_file, g, send_from_directory
from flask_cors import CORS
from mysql.connector import connect
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import datetime
from flask import make_response
import os
import os
from pathlib import Path
import logging
import mysql.connector
from functools import wraps
from dotenv import load_dotenv
import json
from fpdf import FPDF
import io
import traceback
from decimal import Decimal
from werkzeug.utils import secure_filename
import csv
import requests
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import re


app=Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "http://localhost:8083", "http://localhost:8084"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

load_dotenv()


db_config = {
    "host":os.getenv("DB_HOST", 'Blandine.mysql.pythonanywhere-services.com'),
    "user":os.getenv("DB_USER", 'Blandine'),
    "password":os.getenv("DB_PASSWORD", 'TestPassword123!'),
    "database":os.getenv("DB_NAME", 'Blandine$default'),
    "port":os.getenv("DB_PORT", 3306)
}


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET', 'secret'), algorithms=['HS256'])
            g.user_id = data['user_id']
            g.user_role = data['role']
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s AND is_active = TRUE", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({'error': 'Invalid email or password.'}), 401

        # Check password
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid email or password.'}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role']
        }, os.getenv('JWT_SECRET', 'secret'), algorithm='HS256')

        # Remove sensitive info before sending
        user.pop('password_hash', None)

        return jsonify({'token': token, 'user': user}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'hr' or 'candidate'
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    skills = data.get('skills')
    # New fields for candidates
    experience = data.get('experience')
    location = data.get('location')
    education = data.get('education')
    job_position_id = data.get('jobPosition')

    # For simplicity, split name if first_name/last_name not provided
    if not first_name or not last_name:
        if name and ' ' in name:
            first_name, last_name = name.split(' ', 1)
        else:
            first_name = name or ''
            last_name = ''

    if not email or not password or not role or not first_name:
        return jsonify({'error': 'Missing required fields.'}), 400

    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Check if email already exists
        cursor.execute("SELECT id FROM Users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already registered.'}), 409
        # Hash password
        hashed_pw = generate_password_hash(password)
        # Insert user
        if role == 'candidate':
            cursor.execute(
                """
                INSERT INTO Users (email, password_hash, role, first_name, last_name, skills, experience, location, education, job_position_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (email, hashed_pw, role, first_name, last_name, skills, experience, location, education, job_position_id)
            )
        else:
            cursor.execute(
                "INSERT INTO Users (email, password_hash, role, first_name, last_name, skills) VALUES (%s, %s, %s, %s, %s, %s)",
                (email, hashed_pw, role, first_name, last_name, skills)
            )
        user_id = cursor.lastrowid
        # Insert into profile table
        if role == 'hr':
            cursor.execute("INSERT INTO HRProfiles (user_id) VALUES (%s)", (user_id,))
        elif role == 'candidate':
            cursor.execute("INSERT INTO CandidateProfiles (user_id) VALUES (%s)", (user_id,))
        conn.commit()
        # Fetch user info
        cursor.execute("SELECT * FROM Users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role']
        }, os.getenv('JWT_SECRET', 'secret'), algorithm='HS256')
        user.pop('password_hash', None)
        return jsonify({'token': token, 'user': user}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile():
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE id = %s", (g.user_id,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User not found.'}), 404
        user.pop('password_hash', None)
        # Fetch extra profile info
        if g.user_role == 'hr':
            cursor.execute("SELECT * FROM HRProfiles WHERE user_id = %s", (g.user_id,))
            profile = cursor.fetchone() or {}
        elif g.user_role == 'candidate':
            cursor.execute("SELECT * FROM CandidateProfiles WHERE user_id = %s", (g.user_id,))
            profile = cursor.fetchone() or {}
        else:
            profile = {}
        cursor.close()
        conn.close()
        return jsonify({'user': user, 'profile': profile}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.get_json()
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Update Users table
        user_fields = ['first_name', 'last_name', 'email', 'phone', 'location', 'bio']
        user_updates = []
        user_values = []
        for field in user_fields:
            if field in data:
                user_updates.append(f"{field} = %s")
                user_values.append(data[field])
        if user_updates:
            cursor.execute(f"UPDATE Users SET {', '.join(user_updates)} WHERE id = %s", (*user_values, g.user_id))
        # Update profile table
        if g.user_role == 'hr':
            # Map frontend fields to DB columns
            profile_fields = {
                'company': 'company',
                'department': 'department',
                'jobTitle': 'job_title',
            }
            table = 'HRProfiles'
        elif g.user_role == 'candidate':
            profile_fields = {
                'cv': 'cv',
                'skills': 'skills',
                'experience': 'experience',
                'education': 'education',
            }
            table = 'CandidateProfiles'
        else:
            profile_fields = {}
            table = None
        if table and profile_fields:
            profile_updates = []
            profile_values = []
            for field, db_col in profile_fields.items():
                if field in data:
                    profile_updates.append(f"{db_col} = %s")
                    profile_values.append(data[field])
            if profile_updates:
                cursor.execute(f"UPDATE {table} SET {', '.join(profile_updates)} WHERE user_id = %s", (*profile_values, g.user_id))
        conn.commit()
        # Return updated profile
        cursor.execute("SELECT * FROM Users WHERE id = %s", (g.user_id,))
        user = cursor.fetchone()
        user.pop('password_hash', None)
        if g.user_role == 'hr':
            cursor.execute("SELECT * FROM HRProfiles WHERE user_id = %s", (g.user_id,))
            profile = cursor.fetchone() or {}
        elif g.user_role == 'candidate':
            cursor.execute("SELECT * FROM CandidateProfiles WHERE user_id = %s", (g.user_id,))
            profile = cursor.fetchone() or {}
        else:
            profile = {}
        cursor.close()
        conn.close()
        return jsonify({'user': user, 'profile': profile}), 200
    except Exception as e:
        print('Error in update_profile:', str(e))
        print('Incoming data:', data)
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/profile', methods=['GET'])
@token_required
def get_candidate_profile():
    if g.user_role != 'candidate':
        return jsonify({'error': 'Unauthorized: Only candidates can access this endpoint.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE id = %s", (g.user_id,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User not found.'}), 404
        user.pop('password_hash', None)
        cursor.execute("SELECT * FROM CandidateProfiles WHERE user_id = %s", (g.user_id,))
        profile = cursor.fetchone()
        if not profile:
            # Create a new profile row if missing
            cursor.execute("INSERT INTO CandidateProfiles (user_id) VALUES (%s)", (g.user_id,))
            conn.commit()
            cursor.execute("SELECT * FROM CandidateProfiles WHERE user_id = %s", (g.user_id,))
            profile = cursor.fetchone()
        if not profile:
            profile = {}
        # Map DB fields to frontend fields
        def to_float(val):
            from decimal import Decimal
            return float(val) if isinstance(val, Decimal) else val
        mapped_profile = {
            'linkedIn': profile.get('linkedin_url', ''),
            'github': profile.get('github_url', ''),
            'portfolio': profile.get('portfolio_url', ''),
            'totalExperience': profile.get('total_experience', ''),
            'educationLevel': profile.get('education_level', ''),
            'currentSalary': to_float(profile.get('current_salary', '')),
            'expectedSalary': to_float(profile.get('expected_salary', '')),
            'availabilityDate': profile.get('availability_date', ''),
        }
        cursor.close()
        conn.close()
        return jsonify({'user': user, 'profile': mapped_profile}), 200
    except Exception as e:
        print('Error in get_candidate_profile:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/profile', methods=['PUT'])
@token_required
def update_candidate_profile():
    if g.user_role != 'candidate':
        return jsonify({'error': 'Unauthorized: Only candidates can access this endpoint.'}), 403
    data = request.get_json()
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Update Users table
        user_fields = ['first_name', 'last_name', 'email', 'phone', 'location', 'bio']
        user_updates = []
        user_values = []
        for field in user_fields:
            # Only update if field is present and not empty
            if field in data and data[field] not in [None, '']:
                user_updates.append(f"{field} = %s")
                user_values.append(data[field])
        if user_updates:
            cursor.execute(f"UPDATE Users SET {', '.join(user_updates)} WHERE id = %s", (*user_values, g.user_id))
        # Update CandidateProfiles table
        profile_fields = {
            'linkedIn': 'linkedin_url',
            'github': 'github_url',
            'portfolio': 'portfolio_url',
            'totalExperience': 'total_experience',
            'educationLevel': 'education_level',
            'currentSalary': 'current_salary',
            'expectedSalary': 'expected_salary',
            'availabilityDate': 'availability_date',
        }
        profile_updates = []
        profile_values = []
        for field, db_col in profile_fields.items():
            if field in data and data[field] not in [None, '']:
                profile_updates.append(f"{db_col} = %s")
                profile_values.append(data[field])
        if profile_updates:
            cursor.execute(f"UPDATE CandidateProfiles SET {', '.join(profile_updates)} WHERE user_id = %s", (*profile_values, g.user_id))
        conn.commit()
        # Return updated profile
        cursor.execute("SELECT * FROM Users WHERE id = %s", (g.user_id,))
        user = cursor.fetchone()
        user.pop('password_hash', None)
        cursor.execute("SELECT * FROM CandidateProfiles WHERE user_id = %s", (g.user_id,))
        profile = cursor.fetchone()
        if not profile:
            profile = {}
        # Map DB fields to frontend fields
        def to_float(val):
            from decimal import Decimal
            return float(val) if isinstance(val, Decimal) else val
        mapped_profile = {
            'linkedIn': profile.get('linkedin_url', ''),
            'github': profile.get('github_url', ''),
            'portfolio': profile.get('portfolio_url', ''),
            'totalExperience': profile.get('total_experience', ''),
            'educationLevel': profile.get('education_level', ''),
            'currentSalary': to_float(profile.get('current_salary', '')),
            'expectedSalary': to_float(profile.get('expected_salary', '')),
            'availabilityDate': profile.get('availability_date', ''),
        }
        cursor.close()
        conn.close()
        return jsonify({'user': user, 'profile': mapped_profile}), 200
    except Exception as e:
        print('Error in update_candidate_profile:', str(e))
        print('Incoming data:', data)
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobapplications', methods=['POST'])
@token_required
def submit_job_application():
    try:
        # Get form fields
        job_position_id = request.form.get('job_position_id')
        cover_letter = request.form.get('cover_letter')
        reason_for_applying = request.form.get('reason_for_applying')
        compensation_expectation = request.form.get('compensation_expectation')
        available_start_date = request.form.get('available_start_date')
        additional_info = request.form.get('additional_info')

        # Handle file uploads
        cv_file = request.files.get('cv')
        cover_letter_file = request.files.get('coverLetter')
        portfolio_file = request.files.get('portfolio')

        upload_dir = os.path.join('uploads', 'applications')
        os.makedirs(upload_dir, exist_ok=True)
        def save_file(file):
            if file:
                filename = secure_filename(file.filename)
                path = os.path.join(upload_dir, filename)
                file.save(path)
                return path
            return None

        cv_path = save_file(cv_file)
        cover_letter_path = save_file(cover_letter_file)
        portfolio_path = save_file(portfolio_file)

        # Insert into DB
        conn = connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO jobapplications (
                job_position_id, candidate_id, cover_letter, cv_file, cover_letter_file, additional_documents, status, applied_at, updated_at
            ) VALUES (%s, %s, %s, %s, %s, %s, 'submitted', NOW(), NOW())
        """, (
            job_position_id, g.user_id, cover_letter, cv_path, cover_letter_path,
            json.dumps({'portfolio': portfolio_path, 'reason_for_applying': reason_for_applying, 'compensation_expectation': compensation_expectation, 'available_start_date': available_start_date, 'additional_info': additional_info})
        ))
        conn.commit()
        application_id = cursor.lastrowid

        # Gather all relevant data for the prompt
        conn2 = connect(**db_config)
        cursor2 = conn2.cursor(dictionary=True)
        cursor2.execute('''
            SELECT ja.id as application_id, ja.job_position_id, jp.title as job_title, jp.requirements as job_requirements, jp.description as job_description, jp.department as job_department, jp.location as job_location, jp.employment_type as job_employment_type, jp.salary_min, jp.salary_max, jp.currency, jp.status as job_status, u.first_name, u.last_name, u.email, u.skills as candidate_skills, u.experience as candidate_experience, u.education as candidate_education, ja.status, ja.applied_at
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            WHERE ja.id = %s
        ''', (application_id,))
        app = cursor2.fetchone()
        cursor2.close()
        conn2.close()

        # Call DeepSeek AI
        endpoint = "https://models.github.ai/inference"
        model = "deepseek/DeepSeek-V3-0324"
        token = os.environ.get("GITHUB_TOKEN")
        client = ChatCompletionsClient(endpoint=endpoint, credential=AzureKeyCredential(token))

        prompt = f"""
You are an expert HR AI assistant. Given the following job position and candidate details, score the candidate's fit for the job on a scale of 0 to 100 (100 = perfect fit). Also, provide a short explanation (1-2 sentences) for the score.

Job Title: {app['job_title']}
Job Requirements: {app['job_requirements']}
Job Description: {app['job_description']}
Department: {app['job_department']}
Location: {app['job_location']}
Employment Type: {app['job_employment_type']}

Candidate Name: {app['first_name']} {app['last_name']}
Email: {app['email']}
Skills: {app['candidate_skills']}
Experience (years): {app['candidate_experience']}
Education: {app['candidate_education']}

Respond in JSON with keys 'score' (0-100 integer) and 'explanation' (string).
"""

        try:
            response = client.complete(
                messages=[
                    SystemMessage(""),
                    UserMessage(prompt),
                ],
                temperature=0.8,
                top_p=0.1,
                max_tokens=4096,
                model=model
            )
            # Log the raw response for debugging
            print("DeepSeek raw response:", response)
            content = getattr(response.choices[0].message, "content", None)
            if not content or not content.strip():
                raise ValueError("DeepSeek returned empty response. Check your GITHUB_TOKEN and API access.")
            # Correct regex for Python
            match = re.search(r'```(?:json)?\s*([\s\S]+?)\s*```', content, re.IGNORECASE)
            if match:
                json_str = match.group(1).strip()
            else:
                # Fallback: try to parse the content directly if it looks like JSON
                json_str = content.strip()
                # Optionally, only do this if it starts with '{' and ends with '}'
                if not (json_str.startswith('{') and json_str.endswith('}')):
                    raise ValueError(f"AI response not in expected JSON format: {content}")
            import json as pyjson
            ai_result = pyjson.loads(json_str)
            ai_score = int(ai_result.get('score', 0))
            ai_explanation = ai_result.get('explanation', '')
        except Exception as e:
            ai_score = 0
            ai_explanation = f"AI error: {str(e)}"

        # Insert into applicationscores
        conn3 = connect(**db_config)
        cursor3 = conn3.cursor()
        cursor3.execute(
            """
            INSERT INTO applicationscores (application_id, type, score, explanation)
            VALUES (%s, %s, %s, %s)
            """,
            (application_id, 'ai', ai_score, ai_explanation)
        )
        conn3.commit()
        cursor3.close()
        conn3.close()

        return jsonify({'message': 'Application submitted successfully.'}), 201
    except Exception as e:
        
        if hasattr(e, 'errno') and e.errno == 1062:
            return jsonify({'error': 'You have already applied for this position.'}), 409
        print('Error in submit_job_application:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<path:filename>', methods=['GET'])
@token_required
def download_file(filename):
    upload_dir = os.path.join('uploads', 'applications')
    filename = os.path.basename(filename)
    file_path = os.path.join(upload_dir, filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found.'}), 404
    return send_from_directory(upload_dir, filename, as_attachment=True)

def convert_decimal(obj):
    if isinstance(obj, list):
        return [convert_decimal(item) for item in obj]
    if isinstance(obj, dict):
        return {k: float(v) if isinstance(v, Decimal) else v for k, v in obj.items()}
    return obj

@app.route('/api/jobpositions', methods=['GET'])
@token_required
def get_job_positions():
    conn = connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobpositions")
    positions = cursor.fetchall()
    positions = convert_decimal(positions)
    cursor.close()
    conn.close()
    return jsonify({'positions': positions}), 200

@app.route('/api/jobpositions/<int:position_id>', methods=['GET'])
@token_required
def get_job_position(position_id):
    conn = connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jobpositions WHERE id = %s", (position_id,))
    position = cursor.fetchone()
    position = convert_decimal(position) if position else None
    cursor.close()
    conn.close()
    if not position:
        return jsonify({'error': 'Job position not found'}), 404
    return jsonify({'position': position}), 200

@app.route('/api/jobpositions', methods=['POST'])
@token_required
def create_job_position():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can create job positions.'}), 403
    data = request.get_json()
    required_fields = ['title', 'description', 'requirements', 'department', 'location', 'employment_type', 'salary_min', 'salary_max', 'currency', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            INSERT INTO jobpositions (title, description, requirements, department, location, employment_type, salary_min, salary_max, currency, posted_by, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['title'], data['description'], data['requirements'], data['department'], data['location'], data['employment_type'], data['salary_min'], data['salary_max'], data['currency'], g.user_id, data['status']
        ))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM jobpositions WHERE id = %s", (new_id,))
        new_position = cursor.fetchone()
        new_position = convert_decimal(new_position)
        cursor.close()
        conn.close()
        return jsonify({'message': 'Job position created', 'position': new_position}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobpositions/<int:position_id>', methods=['PUT'])
@token_required
def update_job_position(position_id):
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can update job positions.'}), 403
    data = request.get_json()
    allowed_fields = ['title', 'description', 'requirements', 'department', 'location', 'employment_type', 'salary_min', 'salary_max', 'currency', 'status']
    updates = []
    values = []
    for field in allowed_fields:
        if field in data:
            updates.append(f"{field} = %s")
            values.append(data[field])
    if not updates:
        return jsonify({'error': 'No fields to update.'}), 400
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(f"UPDATE jobpositions SET {', '.join(updates)} WHERE id = %s", (*values, position_id))
        conn.commit()
        cursor.execute("SELECT * FROM jobpositions WHERE id = %s", (position_id,))
        updated_position = cursor.fetchone()
        updated_position = convert_decimal(updated_position)
        cursor.close()
        conn.close()
        return jsonify({'message': 'Job position updated', 'position': updated_position}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobpositions/<int:position_id>', methods=['DELETE'])
@token_required
def delete_job_position(position_id):
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can delete job positions.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM jobpositions WHERE id = %s", (position_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/my-applications', methods=['GET'])
@token_required
def get_my_applications():
    if g.user_role != 'candidate':
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT ja.id, ja.job_position_id, jp.title as job_title, ja.status, ja.applied_at, ja.cv_file, ja.cover_letter_file, ja.additional_documents
            FROM jobapplications ja
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            WHERE ja.candidate_id = %s
            ORDER BY ja.applied_at DESC
        ''', (g.user_id,))
        applications = cursor.fetchall()
        # Parse additional_documents JSON for portfolio and convert bytes to str
        for app in applications:
            # Convert bytes fields to str
            for k, v in app.items():
                if isinstance(v, bytes):
                    app[k] = v.decode('utf-8')
            try:
                docs = json.loads(app.get('additional_documents') or '{}')
                app['portfolio'] = docs.get('portfolio', None)
            except Exception:
                app['portfolio'] = None
        cursor.close()
        conn.close()
        return jsonify({'applications': applications}), 200
    except Exception as e:
        print('Error in get_my_applications:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/my-applications/pdf', methods=['GET'])
@token_required
def download_applications_pdf():
    if g.user_role != 'candidate':
        return jsonify({'error': 'Unauthorized'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT ja.id, jp.title as job_title, ja.status, ja.applied_at
            FROM jobapplications ja
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            WHERE ja.candidate_id = %s
            ORDER BY ja.applied_at DESC
        ''', (g.user_id,))
        applications = cursor.fetchall()
        cursor.close()
        conn.close()

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(0, 10, "Your Job Applications", ln=True, align="C")
        pdf.ln(5)

        # Table header
        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 10, "Job Title", 1)
        pdf.cell(30, 10, "Status", 1)
        pdf.cell(40, 10, "Applied At", 1)
        pdf.ln()

        pdf.set_font("Arial", "", 10)
        for app in applications:
            pdf.cell(60, 10, str(app['job_title']), 1)
            pdf.cell(30, 10, str(app['status']), 1)
            pdf.cell(40, 10, str(app['applied_at'].strftime('%Y-%m-%d')), 1)
            pdf.ln()

        pdf_output = pdf.output(dest='S').encode('latin1')
        response = make_response(pdf_output)
        response.headers.set('Content-Type', 'application/pdf')
        response.headers.set('Content-Disposition', 'attachment', filename='my_applications.pdf')
        return response
    except Exception as e:
        print('Error in download_applications_pdf:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates', methods=['GET'])
@token_required
def get_candidates():
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Join candidateprofilesview with jobpositions to get position title
        cursor.execute("""
            SELECT cpv.*, jp.title AS position_applied
            FROM candidateprofilesview cpv
            LEFT JOIN users u ON cpv.id = u.id
            LEFT JOIN jobpositions jp ON u.job_position_id = jp.id
            WHERE u.role = 'candidate'
        """)
        candidates_raw = cursor.fetchall()
        candidates = []
        for candidate in candidates_raw:
            processed_candidate = {}
            for key, value in candidate.items():
                if isinstance(value, Decimal):
                    processed_candidate[key] = float(value)
                elif isinstance(value, bytes):
                    processed_candidate[key] = value.decode('utf-8')
                else:
                    processed_candidate[key] = value
            processed_candidate['name'] = processed_candidate.pop('full_name', '')
            # Ensure experience is always an integer
            exp = processed_candidate.pop('total_experience', 0)
            try:
                processed_candidate['experience'] = int(exp) if exp is not None else 0
            except Exception:
                processed_candidate['experience'] = 0
            processed_candidate['education'] = processed_candidate.pop('education_level', '')
            if 'rating' not in processed_candidate:
                processed_candidate['rating'] = None
            # Always use skills from the view (never fallback to users.skills)
            if processed_candidate.get('skills'):
                processed_candidate['skills'] = [s.strip() for s in processed_candidate['skills'].split(',') if s.strip()]
            else:
                processed_candidate['skills'] = []
            # position_applied is already included

            # --- Accurate score calculation ---
            # Get the most recent application for this candidate
            score = 0
            try:
                cursor2 = conn.cursor(dictionary=True)
                cursor2.execute("""
                    SELECT id FROM jobapplications
                    WHERE candidate_id = %s
                    ORDER BY applied_at DESC LIMIT 1
                """, (processed_candidate['id'],))
                app_row = cursor2.fetchone()
                if app_row:
                    application_id = app_row['id']
                    cursor2.execute("""
                        SELECT SUM(score) as total_score FROM applicationscores
                        WHERE application_id = %s
                    """, (application_id,))
                    score_row = cursor2.fetchone()
                    score = int(score_row['total_score']) if score_row and score_row['total_score'] is not None else 0
                cursor2.close()
            except Exception as e:
                score = 0
            processed_candidate['score'] = score
            candidates.append(processed_candidate)
        cursor.close()
        conn.close()
        return jsonify(candidates), 200
    except Exception as e:
        print(f"Error in get_candidates: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/simple', methods=['GET', 'OPTIONS'])
def get_simple_candidates():
    if request.method == 'OPTIONS':
        return '', 200
    return _get_simple_candidates_authenticated()

@token_required
def _get_simple_candidates_authenticated():
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, first_name, last_name, skills, education, location, experience
            FROM users
            WHERE role = 'candidate'
        """)
        candidates = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(candidates), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/<int:candidate_id>', methods=['PUT'])
@token_required
def update_candidate(candidate_id):
    data = request.get_json()
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Only allow update if user is a candidate
        cursor.execute("SELECT * FROM users WHERE id = %s AND role = 'candidate'", (candidate_id,))
        candidate = cursor.fetchone()
        if not candidate:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Candidate not found'}), 404
        # Build update fields
        fields = []
        values = []
        for field in ['first_name', 'last_name', 'skills', 'education', 'location', 'experience']:
            if field in data:
                fields.append(f"{field} = %s")
                values.append(data[field])
        if fields:
            cursor.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = %s", (*values, candidate_id))
            conn.commit()
        # Return updated candidate
        cursor.execute("SELECT id, first_name, last_name, skills, education, location, experience FROM users WHERE id = %s", (candidate_id,))
        updated = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify(updated), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/simple/csv', methods=['GET'])
@token_required
def download_simple_candidates_csv():
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, first_name, last_name, skills, education, location, experience
            FROM users
            WHERE role = 'candidate'
        """)
        candidates = cursor.fetchall()
        cursor.close()
        conn.close()
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'First Name', 'Last Name', 'Skills', 'Education', 'Location', 'Experience'])
        for c in candidates:
            writer.writerow([
                c['id'],
                c['first_name'],
                c['last_name'],
                c['skills'],
                c['education'],
                c['location'],
                c['experience']
            ])
        output.seek(0)
        return (
            output.getvalue(),
            200,
            {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=candidates.csv'
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/<int:candidate_id>', methods=['DELETE'])
@token_required
def delete_candidate(candidate_id):
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can delete candidates.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor()
        # Check if candidate exists
        cursor.execute("SELECT id FROM users WHERE id = %s AND role = 'candidate'", (candidate_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Candidate not found.'}), 404
        # Delete candidate (CASCADE will remove from candidateprofiles, userskills, etc)
        cursor.execute("DELETE FROM users WHERE id = %s AND role = 'candidate'", (candidate_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/applications', methods=['GET'])
@token_required
def get_all_applications_admin():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can view all applications.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT 
                ja.id as application_id,
                ja.job_position_id,
                jp.title as job_title,
                ja.candidate_id,
                u.first_name, u.last_name, u.email,
                ja.status, ja.applied_at, ja.cv_file, ja.cover_letter_file, ja.additional_documents
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            ORDER BY ja.applied_at DESC
        ''')
        applications = cursor.fetchall()
        for app in applications:
            # Parse additional_documents JSON for portfolio and other info
            try:
                docs = json.loads(app.get('additional_documents') or '{}')
                app['portfolio'] = docs.get('portfolio', None)
                app['reason_for_applying'] = docs.get('reason_for_applying', None)
                app['compensation_expectation'] = docs.get('compensation_expectation', None)
                app['available_start_date'] = docs.get('available_start_date', None)
                app['additional_info'] = docs.get('additional_info', None)
            except Exception:
                app['portfolio'] = None
                app['reason_for_applying'] = None
                app['compensation_expectation'] = None
                app['available_start_date'] = None
                app['additional_info'] = None
            # Convert bytes fields to str
            for k, v in app.items():
                if isinstance(v, bytes):
                    app[k] = v.decode('utf-8')
        cursor.close()
        conn.close()
        return jsonify({'applications': applications}), 200
    except Exception as e:
        print('Error in get_all_applications_admin:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/applications/<int:application_id>', methods=['DELETE'])
@token_required
def delete_application_admin(application_id):
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can delete applications.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM jobapplications WHERE id = %s", (application_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Application not found.'}), 404
        cursor.execute("DELETE FROM jobapplications WHERE id = %s", (application_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print('Error in delete_application_admin:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/applications/pdf', methods=['GET'])
@token_required
def download_applications_pdf_admin():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can download applications PDF.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT ja.id as application_id, ja.job_position_id, jp.title as job_title, ja.candidate_id,
                   u.first_name, u.last_name, u.email, ja.status, ja.applied_at
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            ORDER BY ja.applied_at DESC
        ''')
        applications = cursor.fetchall()
        cursor.close()
        conn.close()

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(0, 10, "All Job Applications", ln=True, align="C")
        pdf.ln(5)

        # Table header
        pdf.set_font("Arial", "B", 11)
        pdf.cell(40, 10, "Candidate", 1)
        pdf.cell(50, 10, "Email", 1)
        pdf.cell(40, 10, "Job Title", 1)
        pdf.cell(25, 10, "Status", 1)
        pdf.cell(35, 10, "Applied At", 1)
        pdf.ln()

        pdf.set_font("Arial", "", 10)
        for app in applications:
            candidate = f"{app['first_name']} {app['last_name']}"
            pdf.cell(40, 10, candidate[:25], 1)
            pdf.cell(50, 10, app['email'][:30], 1)
            pdf.cell(40, 10, app['job_title'][:20], 1)
            pdf.cell(25, 10, str(app['status']), 1)
            applied_at = app['applied_at'].strftime('%Y-%m-%d') if hasattr(app['applied_at'], 'strftime') else str(app['applied_at'])
            pdf.cell(35, 10, applied_at, 1)
            pdf.ln()

        pdf_output = pdf.output(dest='S').encode('latin1')
        response = make_response(pdf_output)
        response.headers.set('Content-Type', 'application/pdf')
        response.headers.set('Content-Disposition', 'attachment', filename='all_applications.pdf')
        return response
    except Exception as e:
        print('Error in download_applications_pdf_admin:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/ai-score-applications', methods=['GET'])
@token_required
def ai_score_applications():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can use AI scoring.'}), 403
    results = []
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT ja.id as application_id, ja.job_position_id, jp.title as job_title, jp.requirements as job_requirements, jp.description as job_description, jp.department as job_department, jp.location as job_location, jp.employment_type as job_employment_type, jp.salary_min, jp.salary_max, jp.currency, jp.status as job_status, u.first_name, u.last_name, u.email, u.skills as candidate_skills, u.experience as candidate_experience, u.education as candidate_education, ja.status, ja.applied_at
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            ORDER BY ja.applied_at DESC
        ''')
        applications = cursor.fetchall()
        cursor.close()
        conn.close()

        puter_api_key = os.getenv('PUTER_API_KEY')
        if not puter_api_key:
            return jsonify({'error': 'PUTER_API_KEY not set in environment.'}), 500
        for app in applications:
            prompt = f"""
You are an expert HR AI assistant. Given the following job position and candidate details, score the candidate's fit for the job on a scale of 0 to 100 (100 = perfect fit). Also, provide a short explanation (1-2 sentences) for the score.

Job Title: {app['job_title']}
Job Requirements: {app['job_requirements']}
Job Description: {app['job_description']}
Department: {app['job_department']}
Location: {app['job_location']}
Employment Type: {app['job_employment_type']}

Candidate Name: {app['first_name']} {app['last_name']}
Email: {app['email']}
Skills: {app['candidate_skills']}
Experience (years): {app['candidate_experience']}
Education: {app['candidate_education']}

Respond in JSON with keys 'score' (0-100 integer) and 'explanation' (string)."""
            try:
                response = requests.post(
                    'https://api.puter.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {puter_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                            {"role": "user", "content": prompt}
                        ]
                    },
                    timeout=30
                )
                response.raise_for_status()
                data = response.json()
                content = data['choices'][0]['message']['content']
                # Correct regex for Python
                match = re.search(r'```(?:json)?\s*([\s\S]+?)\s*```', content, re.IGNORECASE)
                if match:
                    json_str = match.group(1).strip()
                else:
                    # Fallback: try to parse the content directly if it looks like JSON
                    json_str = content.strip()
                    # Optionally, only do this if it starts with '{' and ends with '}'
                    if not (json_str.startswith('{') and json_str.endswith('}')):
                        raise ValueError(f"AI response not in expected JSON format: {content}")
                import json as pyjson
                ai_result = pyjson.loads(json_str)
                ai_score = int(ai_result.get('score', 0))
                ai_explanation = ai_result.get('explanation', '')
            except Exception as e:
                ai_score = 0
                ai_explanation = f"AI error: {str(e)}"
            results.append({**app, 'ai_score': ai_score, 'ai_explanation': ai_explanation})
        return jsonify({'applications': results}), 200
    except Exception as e:
        print('Error in ai_score_applications:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/applications/with-scores', methods=['GET'])
@token_required
def get_applications_with_scores():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can view all applications.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT 
                ja.id as application_id,
                ja.job_position_id,
                jp.title as job_title,
                ja.candidate_id,
                u.first_name, u.last_name, u.email,
                u.skills as candidate_skills,
                u.experience as candidate_experience,
                u.education as candidate_education,
                ja.status, ja.applied_at, ja.cv_file, ja.cover_letter_file, ja.additional_documents,
                s.score as ai_score, s.explanation as ai_explanation
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            LEFT JOIN applicationscores s ON s.application_id = ja.id AND s.type = 'ai'
            ORDER BY ja.applied_at DESC
        ''')
        applications = cursor.fetchall()
        for app in applications:
            # Parse additional_documents JSON for portfolio and other info
            try:
                docs = json.loads(app.get('additional_documents') or '{}')
                app['portfolio'] = docs.get('portfolio', None)
            except Exception:
                app['portfolio'] = None
            # Convert bytes fields to str
            for k, v in app.items():
                if isinstance(v, bytes):
                    app[k] = v.decode('utf-8')
        cursor.close()
        conn.close()
        return jsonify({'applications': applications}), 200
    except Exception as e:
        print('Error in get_applications_with_scores:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/applications/refresh-scores', methods=['POST'])
@token_required
def refresh_all_ai_scores():
    if g.user_role != 'hr':
        return jsonify({'error': 'Unauthorized: Only HR can refresh scores.'}), 403
    try:
        conn = connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT ja.id as application_id, ja.job_position_id, jp.title as job_title, jp.requirements as job_requirements, jp.description as job_description, jp.department as job_department, jp.location as job_location, jp.employment_type as job_employment_type, jp.salary_min, jp.salary_max, jp.currency, jp.status as job_status, u.first_name, u.last_name, u.email, u.skills as candidate_skills, u.experience as candidate_experience, u.education as candidate_education, ja.status, ja.applied_at
            FROM jobapplications ja
            JOIN users u ON ja.candidate_id = u.id
            JOIN jobpositions jp ON ja.job_position_id = jp.id
            ORDER BY ja.applied_at DESC
        ''')
        applications = cursor.fetchall()
        cursor.close()
        conn.close()

        # DeepSeek setup
        endpoint = "https://models.github.ai/inference"
        model = "deepseek/DeepSeek-V3-0324"
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            return jsonify({'error': 'GITHUB_TOKEN not set in environment.'}), 500
        client = ChatCompletionsClient(endpoint=endpoint, credential=AzureKeyCredential(token))

        updated = []
        for app in applications:
            prompt = f"""
You are an expert HR AI assistant. Given the following job position and candidate details, score the candidate's fit for the job on a scale of 0 to 100 (100 = perfect fit). Also, provide a short explanation (1-2 sentences) for the score.

Job Title: {app['job_title']}
Job Requirements: {app['job_requirements']}
Job Description: {app['job_description']}
Department: {app['job_department']}
Location: {app['job_location']}
Employment Type: {app['job_employment_type']}

Candidate Name: {app['first_name']} {app['last_name']}
Email: {app['email']}
Skills: {app['candidate_skills']}
Experience (years): {app['candidate_experience']}
Education: {app['candidate_education']}

Respond in JSON with keys 'score' (0-100 integer) and 'explanation' (string).
"""
            try:
                response = client.complete(
                    messages=[
                        SystemMessage(""),
                        UserMessage(prompt),
                    ],
                    temperature=0.2,
                    top_p=0.9,
                    max_tokens=512,
                    model=model
                )
                # Log the raw response for debugging
                print("DeepSeek raw response:", response)
                content = getattr(response.choices[0].message, "content", None)
                if not content or not content.strip():
                    raise ValueError("DeepSeek returned empty response. Check your GITHUB_TOKEN and API access.")
                # Correct regex for Python
                match = re.search(r'```(?:json)?\s*([\s\S]+?)\s*```', content, re.IGNORECASE)
                if match:
                    json_str = match.group(1).strip()
                else:
                    # Fallback: try to parse the content directly if it looks like JSON
                    json_str = content.strip()
                    # Optionally, only do this if it starts with '{' and ends with '}'
                    if not (json_str.startswith('{') and json_str.endswith('}')):
                        raise ValueError(f"AI response not in expected JSON format: {content}")
                import json as pyjson
                ai_result = pyjson.loads(json_str)
                ai_score = int(ai_result.get('score', 0))
                ai_explanation = ai_result.get('explanation', '')
            except Exception as e:
                ai_score = 0
                ai_explanation = f"AI error: {str(e)}"
            # Upsert into applicationscores
            conn2 = connect(**db_config)
            cursor2 = conn2.cursor()
            cursor2.execute("SELECT id FROM applicationscores WHERE application_id = %s AND type = 'ai'", (app['application_id'],))
            row = cursor2.fetchone()
            if row:
                cursor2.execute(
                    "UPDATE applicationscores SET score = %s, explanation = %s WHERE application_id = %s AND type = 'ai'",
                    (ai_score, ai_explanation, app['application_id'])
                )
            else:
                cursor2.execute(
                    "INSERT INTO applicationscores (application_id, type, score, explanation) VALUES (%s, %s, %s, %s)",
                    (app['application_id'], 'ai', ai_score, ai_explanation)
                )
            conn2.commit()
            cursor2.close()
            conn2.close()
            updated.append({'application_id': app['application_id'], 'ai_score': ai_score, 'ai_explanation': ai_explanation})
        return jsonify({'message': f'Rescored {len(updated)} applications.', 'updated': updated}), 200
    except Exception as e:
        print('Error in refresh_all_ai_scores:', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')



