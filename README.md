# RedPill Surveys

## About the Application
RedPill Surveys is an advanced tool designed to support **Analytic Hierarchy Process (AHP)** for decision analysis. Our application provides maximum flexibility, allowing users to define an unlimited number of **alternatives** and **criteria**, while also enabling collaboration with multiple experts simultaneously. This approach ensures precise comparison of different options, leading to the most accurate final ranking.

### Key Features
- **Custom Decision Models** – Define an unlimited number of alternatives and criteria for decision-making.
- **Expert Collaboration** – Gather input from multiple experts using pairwise comparison.
- **Automated Ranking Calculation** – Compute the final ranking based on the provided data.
- **Consistency Index Calculation** – Evaluate the quality of decisions by calculating the inconsistency index for each comparison matrix.
- **Support for Incomplete Data** – Utilize advanced algorithms to handle incomplete AHP models.
- **Data Import & Export** – Save and load data in file format for easy sharing between users.

With these features, users can build comprehensive decision models enriched with expert data. The **consistency index** feature helps detect potential decision-making issues, making the tool ideal for data-driven decisions, regardless of complexity.

## Technology Stack
The application is built using modern technologies that ensure performance, flexibility, and scalability:

### **Frontend**
- **React with TypeScript** – Provides a fast, responsive, and user-friendly interface.

### **Backend**
- **Python with FastAPI** – A lightweight and efficient API framework that processes data quickly.

### **DevOps**
- **Docker** – The entire application is containerized for easy deployment, configuration, and scaling.

By combining these technologies, RedPill Surveys is not only powerful and functional but also easy to deploy and maintain—an ideal solution for teams working on complex decision-making projects.

## About AHP & Surveys
AHP is a decision-making methodology based on **multi-criteria analysis**. Users define alternatives and criteria, then input comparative data in the form of **pairwise comparison matrices**. The application processes these matrices using advanced algorithms to calculate the final ranking, helping users determine which alternatives best meet their defined criteria.

The collaboration with experts ensures **objective results**, while support for **incomplete data** guarantees usability even when full information is unavailable.

## Installation & Setup
To run the application locally, follow these steps:

### Prerequisites
- **Node.js** (for frontend development)
- **Python 3.8+** (for backend API)
- **Docker** (for containerized deployment)

### Running the Application
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repository/ahp-survey-app.git
   cd ahp-survey-app
   ```
2. Start the application with Docker:
   ```sh
   docker-compose up --build
   ```
   This will start both the frontend and backend in their respective containers.

3. Open the application in your browser at `http://localhost:3000`

### Running Without Docker
If you prefer to run the services manually, follow these steps:

#### Start the Backend API:
   ```sh
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
#### Start the Frontend:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
