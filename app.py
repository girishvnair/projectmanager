# Author: Girish Venugopalan Nair girishvnair@gmail.com
# Date: 2024
# Description: This script handles the backend logic for the project management tool.

from flask import Flask, render_template, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from flask_socketio import SocketIO, join_room, leave_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
socketio = SocketIO(app)
db = SQLAlchemy(app)
CORS(app)
login_manager = LoginManager(app)

# Chat room namespace
ROOMS = {}  # Store active rooms

# Models for User and Project
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    skills = db.Column(db.String(300), nullable=True)  # Only used for resources
    role = db.Column(db.String(50), nullable=False)  # Role: 'admin', 'project_manager', 'resource'

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    participants = db.relationship('User', backref='projects')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    phase = db.Column(db.String(150), nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Admin route to create a user
@app.route('/admin/create_user', methods=['POST'])
@login_required
def create_user():
    if current_user.role != 'admin':
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    new_user = User(
        username=data['username'],
        password=data['password'],
        role=data['role'],
        skills=data.get('skills', '')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

# Admin route to delete a user
@app.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if current_user.role != 'admin':
        return jsonify({"message": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# Signup route for resources and project managers
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    role = data['role']  # Either 'project_manager' or 'resource'

    new_user = User(
        username=data['username'],
        password=data['password'],
        role=role,
        skills=data.get('skills', '') if role == 'resource' else None
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Signup successful"}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        login_user(user)
        return jsonify({"message": "Logged in successfully", "role": user.role}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Create new project
@app.route('/projects', methods=['POST'])
@login_required
def create_project():
    data = request.get_json()
    new_project = Project(name=data['name'], manager_id=current_user.id)
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"message": "Project created successfully"}), 201

# Search for users by skills
@app.route('/users', methods=['GET'])
def search_users():
    skill = request.args.get('skill')
    users = User.query.filter(User.skills.like(f'%{skill}%')).all()
    user_data = [{"id": u.id, "username": u.username, "skills": u.skills} for u in users]
    return jsonify(user_data), 200

# Assign users to a project
@app.route('/projects/<int:project_id>/assign', methods=['POST'])
@login_required
def assign_users(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    selected_user_ids = data['user_ids']
    for user_id in selected_user_ids:
        user = User.query.get(user_id)
        project.participants.append(user)
    db.session.commit()
    return jsonify({"message": "Users assigned to the project"}), 200

# Create phases and tasks under a project
@app.route('/projects/<int:project_id>/phases', methods=['POST'])
@login_required
def create_phases(project_id):
    data = request.get_json()
    tasks = data['tasks']  # List of phases and tasks
    for phase in tasks:
        for task in phase['tasks']:
            new_task = Task(description=task['description'], phase=phase['name'], assignee_id=task['assignee_id'])
            db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Phases and tasks created successfully"}), 201

# Get Kanban board data for a project phase
@app.route('/projects/<int:project_id>/kanban', methods=['GET'])
def get_kanban(project_id):
    phase = request.args.get('phase')
    tasks = Task.query.filter_by(phase=phase).all()
    kanban_data = [{"task": t.description, "assignee": t.assignee_id} for t in tasks]
    return jsonify(kanban_data), 200

# Project route with chat functionality
@app.route("/projects/<project_id>")
def project_detail(project_id):
    return render_template("project.html", project_id=project_id)

# Handle joining chat rooms
@socketio.on('join')
def handle_join(data):
    username = data['username']
    project_id = data['project_id']
    join_room(project_id)
    send(f"{username} has joined the chat", room=project_id)

# Handle sending messages
@socketio.on('message')
def handle_message(data):
    project_id = data['project_id']
    message = data['message']
    username = data['username']
    send({'username': username, 'message': message}, room=project_id)

# Handle leaving rooms
@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    project_id = data['project_id']
    leave_room(project_id)
    send(f"{username} has left the chat", room=project_id)

if __name__ == "__main__":
    db.create_all()
    socketio.run(app, debug=True)
