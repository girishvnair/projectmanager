## Author

Girish Venugopalan Nair girishvnair@gmail.com

Web application using Python (Flask) for the backend and ReactJS for the frontend. 
This custom project management application is designed to streamline project creation, resource allocation, and task management for project managers. It features a user-friendly interface that allows project managers to log in, create projects, search for resources based on skills, and assign them to projects using a drag-and-drop mechanism. With administrator access for managing user roles, including project managers and resources, the app offers real-time notifications and phase-based task structuring. The integrated Kanban board visualizes task progress during scrums, enhancing team collaboration and efficiency. Built using Python and React, the application is fully containerized for easy deployment and scalability on cloud platforms like AWS

Here are some key advantages of your custom-built project management application compared to other commercially available project management tools:

### 1. **Tailored to Specific Needs**
   - **Customization**: Your application is designed to match your team's exact workflow and processes, from skill-based resource allocation to phase-based task management. Commercial tools often require teams to adapt their workflow to the software, whereas your tool can evolve with your needs.
   - **Flexible Phasing and Scrum Integration**: The ability to create custom project phases, define timelines, and manage scrums directly within each phase offers a highly adaptable project structure that most generic tools may not provide in such detail.

### 2. **Simplified Resource Allocation with Skills Matching**
   - **Drag-and-Drop Resource Assignment**: The application allows project managers to search for resources by skill and assign them to projects using an intuitive drag-and-drop interface. This speeds up the process and reduces complexity, ensuring the right person is assigned to the right task.
   - **Skill-Based Search**: Unlike generic project management tools that may require manual input or external spreadsheets to track resource skills, this application directly integrates a skills search, making resource allocation more efficient.

### 3. **User Roles and Permissions**
   - **Role-Based Access**: The application includes distinct roles (Administrator, Project Manager, Resource), with specific features and permissions for each. This level of access control ensures better security and task focus compared to many commercial tools that offer more generic role management.
   - **Administrator Control**: The admin feature allows efficient user management with the ability to create and delete project managers and resources, which is often more rigid in off-the-shelf tools.

### 4. **Integration of Backlogs and Kanban Board**
   - **Direct Scrum and Kanban Integration**: The ability to seamlessly transition from backlog creation to a fully functional Kanban board, where tasks are directly assigned to resources, provides a smoother, more integrated experience compared to tools where users have to switch between multiple views and tabs.
   - **Task Visibility and Assignment**: The application ensures project managers have a clear view of each resource’s task status on the Kanban board, making it easier to track task progression, workload, and bottlenecks.

### 5. **Cost-Effective and Scalable**
   - **Cost Savings**: Since it's a custom-built application, there are no subscription fees that are common in commercial project management tools like Jira, Trello, or Asana. This can lead to significant cost savings for organizations in the long run.
   - **Scalability**: The application is built to run in Docker containers, making it highly scalable and easy to deploy on cloud services like AWS ECS. This gives it the flexibility to grow with your organization without the need for expensive upgrades.

### 6. **Real-Time Notifications**
   - **Instant Resource Notifications**: When resources are assigned to a project, they receive real-time notifications. This feature keeps team members updated, reducing communication delays compared to some tools that require manual status updates.

### 7. **Focus on Simplicity and User Experience**
   - **Ease of Use**: Unlike commercial tools that may have a steep learning curve due to the number of features, your application offers a simple and intuitive user interface tailored to the exact needs of project managers and team members.
   - **Streamlined Workflows**: The application's focus on core project management tasks (assigning resources, managing scrums, task boards) reduces unnecessary clutter and options that can overwhelm users in other tools.

### 8. **Data Privacy and Control**
   - **Full Data Ownership**: Since it's your custom solution, you have complete control over where and how your project data is stored. With commercial tools, you may have to trust third-party cloud providers to secure your data, which may not be ideal for all organizations.
   - **Security Customization**: You can implement security features (such as encryption and SOC2 compliance) as per your organization’s needs, rather than relying on the default security practices of commercial tools.

### 9. **Seamless Deployment and DevOps Integration**
   - **DevOps-Friendly**: The application can easily integrate with your organization's CI/CD pipelines, allowing automated deployments to AWS or other cloud providers. This level of DevOps integration is often a paid or complex feature in off-the-shelf tools.
   - **Dockerized Environment**: The Dockerization of the application ensures consistent performance across different environments and allows easy deployment, scaling, and management through services like AWS ECS.

### 10. **Potential for Continuous Improvement**
   - **Agility in Feature Development**: Since the application is custom-built, you can continuously evolve it by adding new features, improving existing functionalities, or adapting it to meet changing business needs without waiting for updates from a third-party vendor.
   - **Integration with Existing Tools**: The application can be customized to integrate with existing tools (e.g., Slack, Git, CI/CD pipelines) much more easily than many commercial tools that require premium subscriptions for such integrations.

### Conclusion

Compared to commercial project management tools,  custom-built application provides:
- Greater flexibility in terms of features and workflows.
- An enhanced resource allocation system with skill-based search.
- Custom user roles and permissions for better control.
- A cost-effective, scalable solution that integrates seamlessly with DevOps and cloud infrastructure.

This gives your application a clear edge in adaptability, user experience, cost savings, and security, especially for organizations with unique project management needs.

The code is broken down into the following sections:

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
