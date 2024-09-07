Web application using Python (Flask) for the backend and ReactJS for the frontend. The code is broken down into the following sections:

Backend (Flask/Python) - Authentication, project creation, skills and users retrieval, drag-and-drop, project management, Kanban board data.
Frontend (ReactJS) - Authentication, drag-and-drop UI, Kanban board.

Backend (Flask)
Install Required Packages
Install Flask and other necessary dependencies by running the following command:
pip install flask flask_sqlalchemy flask_cors flask_login
Run install.shExplanation

Backend (Flask):
User and Project Models: Stores user data (skills) and project data.

Routes:
/login: Handles authentication.
/projects: Manages project creation and user assignments.
/users: Returns users with specific skills.
/projects/:id/kanban: Returns tasks assigned to users in a specific phase for Kanban board visualization.

Frontend (ReactJS):
Login Page: User authentication.
ProjectPage: Displays user search and drag-and-drop assignment to projects.
KanbanBoard: Displays the Kanban board with resources and tasks for the current phase.
