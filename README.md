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

To clone your code from GitHub, dockerize it, and deploy it on AWS ECS (Elastic Container Service), follow these steps:

### 1. Clone the Code from GitHub

First, the user needs to clone the repository to their local Linux machine:

1. Open a terminal and navigate to the desired directory.
2. Use the following command to clone the GitHub repository:

```bash
git clone https://github.com/girishvnair/projectmanager.git
cd <repository>
```


### 2. Dockerize the Application

You'll need a `Dockerfile` to build the Docker image for the application. Here’s an example `Dockerfile` for a Python Flask backend and a React frontend:

#### `Dockerfile`

```Dockerfile
# Backend (Flask)
FROM python:3.9-slim-buster as backend
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend /app

# Frontend (React)
FROM node:18-alpine as frontend
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend /frontend
RUN npm run build

# Final stage
FROM python:3.9-slim-buster
WORKDIR /app

COPY --from=backend /app /app
COPY --from=frontend /frontend/build /app/frontend/build

EXPOSE 5000
CMD ["python", "app.py"]
```

### 3. Build and Run the Docker Container

Use Docker to build and run the application locally.

#### Build the Docker image

```bash
docker build -t your-app .
```

#### Run the Docker container

```bash
docker run -p 5000:5000 your-app
```

This command will run the application and expose it on port `5000` of your local machine. Verify the app is running by visiting `http://localhost:5000`.

### 4. Push the Docker Image to Amazon ECR (Elastic Container Registry)

#### a) Install the AWS CLI and Docker on your machine

If not already installed, follow the instructions to install:
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Docker](https://docs.docker.com/engine/install/ubuntu/)

#### b) Authenticate Docker to Your Amazon ECR Registry

1. **Login to AWS ECR** (Amazon Elastic Container Registry):

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
```

Replace `<region>` with your AWS region (e.g., `us-east-1`), and `<aws_account_id>` with your AWS account ID.

#### c) Create an ECR Repository

You can create a new ECR repository via the AWS CLI:

```bash
aws ecr create-repository --repository-name your-app
```

#### d) Tag and Push the Docker Image to ECR

1. Tag the Docker image for the ECR repository:

```bash
docker tag your-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/your-app:latest
```

2. Push the image to ECR:

```bash
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/your-app:latest
```

### 5. Deploy the Application on AWS ECS

#### a) Create a Task Definition for AWS ECS

1. Go to the **Amazon ECS** console.
2. In the **Task Definitions** section, click **Create new Task Definition**.
3. Choose **Fargate** as the launch type.
4. Define the container in the task:
   - Container name: `your-app`
   - Image: `<aws_account_id>.dkr.ecr.<region>.amazonaws.com/your-app:latest`
   - Port mappings: `5000:5000`

#### b) Create an ECS Cluster

1. Go to the **ECS** console and click **Create Cluster**.
2. Choose **Networking only** for a Fargate cluster.
3. Follow the prompts to create the cluster.

#### c) Run a Task on the ECS Cluster

1. Go to the **ECS** console, select your cluster, and choose **Run Task**.
2. Choose the **Task Definition** you created earlier.
3. Select **Fargate** as the launch type and configure VPC, Subnets, and Security Groups (make sure the security group allows inbound traffic on port `5000`).
4. Click **Run Task**.

#### d) Access the Application

1. Once the task is running, find the **Public IP** of the ECS service or configure a load balancer in the VPC.
2. Access the application via `http://<public-ip>:5000`.

### 6. Automating Deployment with ECS Service (Optional)

To ensure continuous deployment of your Docker image, you can configure ECS as a service:

1. In the ECS console, select **Create Service**.
2. Choose **Fargate** and select your task definition.
3. Set the desired number of tasks and choose your VPC/Subnets.
4. Optionally, set up an Application Load Balancer (ALB) for better scaling and traffic management.

### Summary of Commands:

1. Clone the repo:
   ```bash
   git clone https://github.com/<username>/<repository>.git
   ```

2. Build and run the Docker container:
   ```bash
   docker build -t your-app .
   docker run -p 5000:5000 your-app
   ```

3. Push to AWS ECR:
   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   docker tag your-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/your-app:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/your-app:latest
   ```

4. Create ECS Task and run it in ECS Cluster through the AWS Console.

This process will allow others to dockerize and deploy your application on AWS ECS.
