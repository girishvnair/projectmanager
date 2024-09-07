from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///projects.db'
db = SQLAlchemy(app)
CORS(app)
login_manager = LoginManager(app)

# Models for User and Project
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    skills = db.Column(db.String(300), nullable=False)  # Comma separated skills

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

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        login_user(user)
        return jsonify({"message": "Logged in successfully"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# Create new project
@app.route('/projects', methods=['POST'])
@login_required
def create_project():
    data = request.get_json()
    new_project = Project(name=data['name'], manager_id=session['user_id'])
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

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)
