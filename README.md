# ExcelAnalytics Backend API

This backend provides user authentication, Excel file upload, chart generation, AI insights, and management for the ExcelAnalytics application. It is built with Node.js, Express, and MongoDB.

## Routes

---

### 1. Register a New User

**Endpoint:** `POST /users/register`

Registers a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user" 
}
```

**Responses:**
- **201 Created**: User registered successfully.
- **400 Bad Request**: Validation error or user already exists.

---

### 2. Login

**Endpoint:** `POST /users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Responses:**
- **200 OK**: Returns JWT token and user info.
- **400 Bad Request**: Invalid credentials.

---

### 3. Logout

**Endpoint:** `POST /users/logout`

**Headers:** Requires authentication (JWT as cookie or Bearer token).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 4. Get User Profile

**Endpoint:** `GET /users/profile`

**Headers:** Requires authentication.

**Response:** User profile (without password).

---

### 5. Get Admin Profile

**Endpoint:** `GET /users/admin-profile`

**Headers:** Requires authentication as admin.

**Response:** Admin profile (without password).

---

### 6. Upload Excel File

**Endpoint:** `POST /data/upload`

**Headers:** Requires authentication.  
**Body:** `multipart/form-data` with a field named `file` (Excel file).

**Response:**
```json
{
  "message": "Excel file uploaded and saved to database",
  "fileName": "example.xlsx",
  "recordId": "record_id",
  "rowCount": 123,
  "data": 
}
```

---

### 7. Get Uploaded Excel Data by ID

**Endpoint:** `GET /data/:id`

**Headers:** Requires authentication.

**Response:**
```json
{
  "fileName": "example.xlsx",
  "data": ,
  "uploadedBy": "user_id",
  "uploadedAt": "2024-06-12T..."
}
```

---

### 8. Get My Uploads

**Endpoint:** `GET /users/my-uploads`

**Headers:** Requires authentication.

**Response:** List of uploaded files by the user.

---

### 9. Delete Uploaded File

**Endpoint:** `DELETE /users/delete-upload/:id`

**Headers:** Requires authentication.

**Response:**
```json
{
  "message": "Upload deleted successfully"
}
```

---

### 10. Chart Record APIs

#### a. Create Chart Record

**Endpoint:** `POST /chart/create`

**Headers:** Requires authentication.

**Request Body:**
```json
{
  "excelRecordId": "excel_data_id",
  "chartType": "bar",
  "xAxis": "column1",
  "yAxis": "column2",
  "chartTitle": "My Chart"
}
```

**Response:** Created chart record.

#### b. Get My Charts

**Endpoint:** `GET /chart/my-charts`

**Headers:** Requires authentication.

**Response:** List of user's chart records.

#### c. Delete Chart Record

**Endpoint:** `DELETE /chart/delete/:id`

**Headers:** Requires authentication.

**Response:**
```json
{
  "message": "Chart record deleted successfully"
}
```

---

### 11. AI Insights API

**Endpoint:** `POST /api/insights`

**Headers:** Requires authentication.

**Request Body:**
```json
{
  "data": [ /* array of row objects from Excel */ ]
}
```

**Response:**
```json
{
  "insights": "AI-generated insights and chart suggestions..."
}
```

---

### 12. Admin APIs

#### a. Get All Users

**Endpoint:** `GET /users/admin/allusers`

**Headers:** Requires admin authentication.

**Response:** List of all users.

#### b. Delete User

**Endpoint:** `DELETE /users/admin/:id`

**Headers:** Requires admin authentication.

**Response:** User deleted message.

#### c. Get All Files

**Endpoint:** `GET /users/admin/allfiles`

**Headers:** Requires admin authentication.

**Response:** List of all uploaded files with uploader info.

#### d. Delete File

**Endpoint:** `DELETE /users/admin/files/:id`

**Headers:** Requires admin authentication.

**Response:** File deleted message.

#### e. Get All Users with Their Uploaded Files

**Endpoint:** `GET /users/admin/users-with-files`

**Headers:** Requires admin authentication.

**Response:** List of users, each with their uploaded files.

---


