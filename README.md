# FinSight — ML-Assisted Personal Finance System

FinSight is a full-stack personal finance management system designed to help users track income and expenses, manage budgets and financial goals, analyze spending patterns, and receive explainable insights and machine-learning forecasts.

The system combines a React frontend with a Node.js/Express backend, MongoDB for data storage, JWT-based authentication, rule-based financial insights, and Python-based forecasting and anomaly detection.

## 🚀 Live Demo

**Frontend:**
https://fin-sight-ten-zeta.vercel.app/

**Backend API:**
https://finsight-simh.onrender.com/

---

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Protected API routes
* Password reset using email OTP
* 90-second OTP expiration
* Hashed OTP storage
* Reset-token protection and reuse prevention
* Profile management
* Request validation
* Centralized error handling
* API rate limiting

### 💰 Expense Management

* Add expenses
* View expenses
* Update expenses
* Delete expenses
* Categorize expenses
* Track spending patterns

### 💵 Income Management

* Add income records
* View income history
* Update income
* Delete income
* Track total income

### 📊 Budget Management

* Create budgets
* Track budget usage
* Monitor spending against budgets
* Identify budget status

### 🎯 Financial Goals

* Create financial goals
* Track goal progress
* Update goals
* Monitor savings progress

### 📈 Financial Analytics

* Income analysis
* Expense analysis
* Savings analysis
* Category-wise spending
* Financial trends
* Dashboard statistics

### 🤖 ML-Assisted Predictions

Python models generate monthly expense forecasts and detect unusual monthly expense totals.

Forecast history and the model/evaluation metadata are available in the Predictions module. Risk assessments and Quick Insights use explainable financial rules rather than an AI model.

### 💡 Rule-Based Financial Insights

The system derives insights from recorded user data, including:

* Savings-rate and cash-flow observations
* Transaction and monthly spending anomaly flags
* Budget status and goal progress
* Contextual recommendations

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router
* Recharts
* Lucide React
* Sonner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Axios
* Nodemailer
* Express Validator
* Jest

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

### Development Tools

* Git
* GitHub
* VS Code
* Thunder Client

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │      Frontend        │
                         │       Vercel         │
                         └──────────┬───────────┘
                                    │
                              REST API / HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │       Backend        │
                         │       Render         │
                         └───────┬───────┬──────┘
                                 │       │
                       ┌─────────┘       └──────────┐
                       ▼                            ▼
              ┌──────────────────┐        ┌──────────────────┐
              │   MongoDB Atlas  │        │ Python ML Layer  │
              │     Database     │        │ Forecasting &    │
              │                  │        │ Anomaly Detection│
              └──────────────────┘        └──────────────────┘
```

---

## 📁 Project Structure

```text
FinSight/
│
├── backend-v1/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   ├── budgetController.js
│   │   ├── goalController.js
│   │   ├── analyticsController.js
│   │   └── predictionController.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── expenseService.js
│   │   ├── incomeService.js
│   │   ├── budgetService.js
│   │   ├── goalService.js
│   │   ├── analyticsService.js
│   │   ├── predictionService.js
│   │   └── riskService.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Budget.js
│   │   ├── Goal.js
│   │   └── Prediction.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── predictionRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validateMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimitMiddleware.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── profileValidator.js
│   │   ├── expenseValidator.js
│   │   ├── incomeValidator.js
│   │   ├── budgetValidator.js
│   │   └── goalValidator.js
│   │
│   ├── utils/
│   │   ├── apiError.js
│   │   ├── asyncHandler.js
│   │   ├── dateUtils.js
│   │   └── response.js
│   │
│   ├── constants/
│   │   ├── categories.js
│   │   ├── transactionTypes.js
│   │   └── predictionModels.js
│   │
│   ├── ml/
│   │   ├── preprocessing/
│   │   ├── forecasting/
│   │   ├── anomaly/
│   │   └── predict/
│   │
│   ├── tests/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── expense/
│   │   ├── income/
│   │   ├── budget/
│   │   ├── goal/
│   │   ├── analytics/
│   │   └── prediction/
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── requirements.txt
│
├── finsight-frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── constants/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── README.md
```

---

## 🔑 Core API Modules

The backend provides REST API modules for:

```text
/api/auth
/api/profile
/api/expenses
/api/income
/api/budgets
/api/goals
/api/analytics
/api/predictions
```

Authentication-protected resources require a valid JWT token.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lakhidaksh-01/FinSight.git

cd FinSight
```

---

## 🔧 Backend Setup

Move into the backend directory:

```bash
cd backend-v1
```

Install dependencies:

```bash
npm install
```

Install the Python ML dependencies (Python 3 must be available):

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file:

```env
NODE_ENV=development

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

PYTHON_PATH=python

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

Open a new terminal and move into the frontend:

```bash
cd finsight-frontend
```

Install dependencies:

```bash
npm install
```

For local development, the frontend uses the Vite proxy configured in `vite.config.js`.

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

The Vite development server forwards API requests from:

```text
/api
```

to:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

### Backend

Required:

```text
MONGO_URI
JWT_SECRET
```

Optional:

```text
NODE_ENV
PORT
PYTHON_PATH
FRONTEND_URL
```

Password-reset email delivery also requires:

```text
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
```

### Frontend

For production deployment:

```env
VITE_API_BASE_URL=https://finsight-simh.onrender.com/api
```

Do not commit real environment variables or secrets to GitHub.

---

## 🧪 Testing

The backend contains automated API tests covering major application modules.

Run the test suite with:

```bash
npm test
```

The project currently includes tests for:

* Authentication
* Profile
* Expenses
* Income
* Budgets
* Goals
* Analytics
* Predictions

---

## 🚀 Deployment

### Frontend

The React/Vite frontend is deployed using Vercel.

Production frontend:

https://fin-sight-ten-zeta.vercel.app/

### Backend

The Node.js/Express backend is deployed using Render.

Production API:

https://finsight-simh.onrender.com/

For a Render deployment, set the service root directory to `backend-v1`, install the Node.js dependencies and Python packages from `requirements.txt`, and use `npm start` as the start command. Configure the required backend environment variables and the SMTP settings if password-reset email is enabled. Set `PYTHON_PATH` when the Python executable is not available as `python`.

For Vercel, set the project root to `finsight-frontend`, use `npm run build`, and use `dist` as the output directory. Set `VITE_API_BASE_URL` to the deployed backend API URL ending in `/api`.

### Database

FinSight uses MongoDB Atlas for cloud database storage.

---

## 🔒 Security Considerations

FinSight includes several security mechanisms:

* JWT authentication
* Protected routes
* Password reset OTP
* OTP expiration
* Hashed OTP storage
* Reset-token protection
* Input validation
* Centralized error handling
* Rate limiting
* Environment-based secret configuration
* CORS configuration

Sensitive credentials are stored using environment variables rather than being committed to the repository.

---

## 📊 Application Modules

The application is organized around the following major modules:

| Module      | Purpose                                |
| ----------- | -------------------------------------- |
| Dashboard   | Overall financial overview             |
| Income      | Track income sources                   |
| Expenses    | Track and categorize expenses          |
| Budgets     | Monitor spending limits                |
| Analytics   | Analyze financial behavior             |
| Predictions | View ML-assisted forecasts             |
| Quick Insights | View rule-based observations and risk indicators |
| Goals       | Track financial targets                |
| Profile     | Manage account and preferences         |

---

## 🧠 Machine Learning Pipeline

The ML layer follows a structured process:

```text
User Financial Data
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Preparation
        │
        ▼
Prediction / Forecasting
        │
        ├───────────────┐
        ▼               ▼
      Monthly Forecast   Anomaly Detection
        │               │
        └───────┬───────┘
                ▼
     Saved Prediction Results
```

Risk assessments and Quick Insights are calculated separately using explicit application rules; they are not Python model outputs.

---

## 🎯 Project Objectives

The main objectives of FinSight are:

1. Provide a centralized platform for personal finance management.
2. Simplify income and expense tracking.
3. Help users monitor budgets and financial goals.
4. Provide meaningful financial analytics.
5. Use machine learning to identify trends and unusual spending.
6. Provide personalized financial insights.
7. Build a secure and scalable full-stack application.
8. Provide a production-deployed financial management system.

---

## 🔮 Future Enhancements

Potential future improvements include:

* Advanced financial forecasting
* More ML models
* Personalized financial recommendations
* Recurring transaction support
* Automated financial reports
* PDF report generation
* More advanced anomaly detection
* Financial goal recommendations
* Notification and reminder system
* Mobile application
* Improved AI-powered financial assistant

---

## 👨‍💻 Developer

**Daksh Lakhi**

B.E. Computer Science Engineering
Chitkara University

### Links

* GitHub: https://github.com/lakhidaksh-01
* LinkedIn: https://linkedin.com/in/daksh-lakhi

---

## 📄 License

This project is developed as an academic/final-year project.

All rights reserved.
