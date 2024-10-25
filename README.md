# Task Management API with Priority, Deadlines, and Team Collaboration
![image](https://github.com/user-attachments/assets/ba3ef80a-af8a-4918-97f7-823c929f15d7)

## Overview
Design and implement a backend for a task management system where users can create tasks, set priorities, assign deadlines, and collaborate with other users in teams. The system will support task categorization, filtering, and sorting based on various criteria, as well as managing tasks with dependencies. Users will receive notifications for overdue tasks and those approaching deadlines.


## API Endpoints
### **Auth Routes**
 - **URL**: `/api/auth/register`
   - **Body**:
    ```json
    { "name": "John Doe","email": "johndoe@example.com","password": "YourSecurePassword123"}
 - **URL**: `/api/auth/login`
   - **Body**:
     ```json
     {"email": "johndoe@example.com", "password": "YourSecurePassword123"
     }
    
### **Task Routes**

#### 1. **Create a New Task**
   - **Method**: `POST`
   - **URL**: `/api/tasks`
   - **Body**:
     ```json
     {
       "title": "Sample Task",
       "description": "This is a sample task description.",
       "assignedTo": "userId",
       "dueDate": "2024-12-31"
     }
     ```

#### 2. **Retrieve All Tasks (Optional Filtering)**
   - **Method**: `GET`
   - **URL**: `/api/tasks`
   - **Query Params** (if applicable):
     - `status=completed` or `assignedTo=userId`

#### 3. **Retrieve a Task by ID**
   - **Method**: `GET`
   - **URL**: `/api/tasks/:id`
     - Replace `:id` with the specific task ID.

#### 4. **Update a Task**
   - **Method**: `PUT`
   - **URL**: `/api/tasks/:id`
     - Replace `:id` with the task ID.
   - **Body**:
     ```json
     {
       "title": "Updated Task Title",
       "description": "Updated description"
     }
     ```

#### 5. **Delete a Task**
   - **Method**: `DELETE`
   - **URL**: `/api/tasks/:id`
     - Replace `:id` with the task ID.

#### 6. **Mark a Task as Complete**
   - **Method**: `PUT`
   - **URL**: `/api/tasks/:id/complete`
     - Replace `:id` with the task ID.

---

### **Team Routes**

#### 1. **Create a New Team**
   - **Method**: `POST`
   - **URL**: `/api/teams`
   - **Body**:
     ```json
     {
       "name": "New Team",
       "owner": "ownerId"
     }
     ```

#### 2. **Retrieve All Teams**
   - **Method**: `GET`
   - **URL**: `/api/teams`

#### 3. **Retrieve a Team by ID**
   - **Method**: `GET`
   - **URL**: `/api/teams/:id`
     - Replace `:id` with the team ID.

#### 4. **Add a Member to a Team**
   - **Method**: `PUT`
   - **URL**: `/api/teams/:id/addMember`
     - Replace `:id` with the team ID.
   - **Body**:
     ```json
     {
       "userId": "newMemberId"
     }
     ```

#### 5. **Remove a Member from a Team**
   - **Method**: `PUT`
   - **URL**: `/api/teams/:id/removeMember`
     - Replace `:id` with the team ID.
   - **Body**:
     ```json
     {
       "userId": "memberIdToRemove"
     }
     ```

#### 6. **Update Team Information**
   - **Method**: `PUT`
   - **URL**: `/api/teams/:id`
     - Replace `:id` with the team ID.
   - **Body**:
     ```json
     {
       "name": "Updated Team Name"
     }
     ```

## Authentication
For each endpoint, if authentication is required, remember to add the `Authorization` header with your token in your requests:

```plaintext
Authorization: Bearer <Your_JWT_Token>
```

## Setup This Project 

```plaintext
git clone Task-Management-Api
```
```plaintext
cd Task-Management-Api
```
```plaintext
npm install
```
```plaintext
node server.js
```
