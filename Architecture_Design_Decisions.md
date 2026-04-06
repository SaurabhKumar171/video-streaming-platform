# 📐 Assumptions and Design Decisions
### Video Streaming Platform Architecture

This document outlines the core architectural assumptions and technical decisions made to ensure **Scalability**, **Performance**, and **Multi-Tenant Isolation**.

---

## 1️⃣ No-Local-FFmpeg Decision

**Decision:**  
Replaced local `fluent-ffmpeg` with **Cloudinary Eager Transformations**

**Assumption:**  
The backend runs on platforms like **Vercel / Render (Free Tier)**:
- No persistent disk
- Strict execution time limits

**Result:**  
- Video transcoding handled in the cloud  
- Backend remains **stateless & lightweight**  
- Eliminates heavy CPU usage and processing delays  

---

## 2️⃣ Multi-Tenant Isolation (organizationId)

**Decision:**  
All database operations are scoped using `organizationId`

**Assumption:**  
Tenants must be completely isolated  
(e.g., Admin A must never see Tenant B's data)

**Implementation Example:**
```js
Model.find({ organizationId: req.user.organizationId })
```

**Result:**  
- Strong **data isolation**
- Prevents cross-tenant data leaks
- Security enforced at database level  

---

## 3️⃣ Event-Driven AI Feedback

**Decision:**  
Background processing runs **after response is sent**

**Assumption:**  
Users should not wait for long processing tasks

**Flow:**
1. Upload request received  
2. Server responds immediately (`201 Created`)  
3. Background job starts  
4. Progress sent via **Socket.io**

**Result:**  
- Faster perceived performance  
- Real-time updates  
- Better UX  

---

## 4️⃣ Adaptive Bitrate (Simulated)

**Decision:**  
Pre-generate multiple stream URLs (720p, 480p)

**Assumption:**  
Users have different network conditions  

**Implementation Idea:**
- Store transformed URLs as strings
- Replace resolution dynamically

**Result:**  
- Instant quality switching  
- No need for complex HLS/DASH setup  
- Reduced implementation complexity  

---

## 5️⃣ Security: JWT + SameSite Cookies

**Decision:**  
Use:
- JWT Authentication  
- Cookies with `SameSite=None`  
- `withCredentials: true`

**Assumption:**  
Frontend and backend are on different domains  
(e.g., Netlify + Render)

**Result:**  
- Secure cross-origin authentication  
- CSRF protection  
- Seamless login experience  

---

## 🧠 Summary

| Area            | Strategy                         | Benefit                     |
|-----------------|---------------------------------|-----------------------------|
| Processing      | Cloudinary                      | Stateless backend           |
| Isolation       | organizationId filtering        | Strong multi-tenancy        |
| UX              | Event-driven updates            | Faster perceived response   |
| Streaming       | Precomputed URLs                | Simple adaptive streaming   |
| Security        | JWT + Cookies                   | Safe cross-domain auth      |

---

## 📌 Conclusion

These design decisions prioritize:
- ⚡ Performance  
- 🔐 Security  
- 🏗️ Scalability  
- 👥 Multi-tenant architecture  

The system is optimized for **modern cloud deployments** and **real-world production constraints**.

---

**Author:** Saurabh Kumar Jha  
