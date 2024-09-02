# ADHD Symptom Tracker Backend

This is the backend API for the ADHD Symptom Tracker application.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Create a `.env` file in the root directory with the following variables:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/adhd-symptom-tracker
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   NODE_ENV=development
   \`\`\`

3. Seed the database with initial data:
   \`\`\`
   node seeder.js
   \`\`\`

4. Start the server:
   \`\`\`
   npm run dev
   \`\`\`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/updatepassword` - Update password

### Symptoms

- `GET /api/symptoms` - Get all symptoms
- `GET /api/symptoms/:id` - Get single symptom
- `POST /api/symptoms` - Create new symptom (admin only)
- `PUT /api/symptoms/:id` - Update symptom (admin only)
- `DELETE /api/symptoms/:id` - Delete symptom (admin only)
- `GET /api/symptoms/categories` - Get all symptom categories
- `POST /api/symptoms/categories` - Create new symptom category (admin only)

### Symptom Logs

- `GET /api/symptom-logs` - Get all symptom logs for current user
- `GET /api/symptom-logs/:id` - Get single symptom log
- `POST /api/symptom-logs` - Create new symptom log
- `PUT /api/symptom-logs/:id` - Update symptom log
- `DELETE /api/symptom-logs/:id` - Delete symptom log
- `GET /api/symptom-logs/range` - Get logs by date range
- `GET /api/symptom-logs/trends` - Get symptom trends
- `GET /api/symptom-logs/baseline` - Get baseline comparison

### Admin

- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/users/:userId/logs` - Get user logs
- `GET /api/admin/export` - Export user data

## Default Users

After running the seeder, you can login with the following credentials:

- Admin User:
  - Email: admin@example.com
  - Password: password123

- Regular User:
  - Email: user@example.com
  - Password: password123
\`\`\`

Now, let's create a file to connect the frontend with the backend:
