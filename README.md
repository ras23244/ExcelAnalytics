# ExcelAnalytics Backend API

This backend provides user authentication and management for the ExcelAnalytics application. It is built with Node.js, Express, and MongoDB.

## Routes

### 1. Register a New User

**Endpoint:** `POST /users/register`

This endpoint is used to register a new user.

### Request Body

The request body should be a JSON object with the following properties:

- `name`: A string with at least 3 characters (required)
- `email`: A string representing a valid email address (required)
- `password`: A string with at least 6 characters (required)
- `role`: (optional) Either `user` or `admin`. Defaults to `user`.

Example:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses

- **201 Created**: User registered successfully.
  - Body:
    ```json
    {
      "token": "jwt_token",
      "newUser": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
      }
    }
    ```

- **400 Bad Request**: Validation error or user already exists.
  - Body:
    ```json
    {
      "errors": [
        {
          "msg": "Error message",
          "param": "parameter",
          "location": "body"
        }
      ]
    }
    ```

    or

    ```json
    {
      "message": "User already exists"
    }
    ```

---

### 2. Login

**Endpoint:** `POST /users/login`

**Input (JSON body):**
```
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Output (JSON):**
```
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    ...
  }
}
```

---

### 3. Logout

**Endpoint:** `POST /users/logout`

**Headers:**
- Requires authentication (send JWT as a cookie named `token` or as a Bearer token in the `Authorization` header)

**Output (JSON):**
```
{
  "message": "Logged out successfully"
}
```


## Author
ExcelAnalytics Team
