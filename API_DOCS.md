# 🎥 Video Streaming Platform API

A scalable backend system for uploading, processing, and streaming
videos with secure authentication and efficient delivery using HTTP
range requests.

------------------------------------------------------------------------

## 🚀 Features

-   🔐 JWT-based Authentication & Authorization
-   🎥 Video Upload (Multipart Support)
-   📡 Adaptive Video Streaming (Range Requests)
-   📂 Video Listing & Filtering
-   ✏️ Full CRUD for Video Management
-   ❤️ Health Monitoring Endpoint

------------------------------------------------------------------------

## 🏗️ Architecture Overview

-   **Backend**: Node.js + Express
-   **Database**: MongoDB
-   **Storage**: Local / Cloud (S3 compatible)
-   **Auth**: JWT
-   **Streaming**: HTTP Range Requests

------------------------------------------------------------------------

## 🔗 Base URLs

  Service          Base URL
  ---------------- -------------------
  Auth Service     `{{BASE_AUTH}}`
  User Service     `{{BASE_USER}}`
  Video Service    `{{BASE_VIDEO}}`
  Health Service   `{{BASE_HEALTH}}`

------------------------------------------------------------------------

## 🔐 Authentication APIs

### Register

`POST /register`

``` json
{
  "username": "boss1",
  "password": "password1",
  "role": "admin"
}
```

### Login

`POST /login`

``` json
{
  "username": "saurabh123",
  "password": "12345"
}
```

### Get Current User

`GET /me`

Header:

    Authorization: Bearer <JWT_TOKEN>

------------------------------------------------------------------------

## 👤 User APIs

### Get All Users

`GET /`

Header:

    Authorization: Bearer <JWT_TOKEN>

------------------------------------------------------------------------

## 🎥 Video APIs

### Upload Video

`POST /upload`

Headers:

    Authorization: Bearer <JWT_TOKEN>
    Content-Type: multipart/form-data

Fields: - file - title - description - category

------------------------------------------------------------------------

### Stream Video

`GET /stream/:videoId`

Header:

    Range: bytes=0-1048576

Supports partial streaming (206 Partial Content).

------------------------------------------------------------------------

### Get Videos

`GET /`

------------------------------------------------------------------------

### Update Video

`PUT /:videoId`

------------------------------------------------------------------------

### Delete Video

`DELETE /:videoId`

------------------------------------------------------------------------

## ❤️ Health Check

`GET /check`

``` json
{
  "status": "OK"
}
```

------------------------------------------------------------------------

## 🔐 Authentication

-   Uses JWT Tokens
-   Pass token in headers:

```{=html}
<!-- -->
```
    Authorization: Bearer <token>

------------------------------------------------------------------------

## ⚙️ Environment Variables

    BASE_AUTH=http://localhost:8000/auth
    BASE_USER=http://localhost:8000/users
    BASE_VIDEO=http://localhost:8000/videos
    BASE_HEALTH=http://localhost:8000/health
    JWT_SECRET=your_secret

------------------------------------------------------------------------

## 📊 Streaming Design Notes

-   Uses HTTP Range Requests
-   Enables:
    -   Fast seeking
    -   Reduced buffering
    -   Efficient bandwidth usage

------------------------------------------------------------------------

## ❌ Error Codes

  Code   Meaning
  ------ --------------
  400    Bad Request
  401    Unauthorized
  403    Forbidden
  404    Not Found
  500    Server Error

------------------------------------------------------------------------

## 🧠 Submission Note

> This system is designed using a modular architecture supporting
> scalable video streaming, secure access control, and efficient media
> delivery.

------------------------------------------------------------------------

## 📌 Author

Saurabh Kumar
