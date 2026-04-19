# 🎬 V-Stream: Cloud-Native Multi-Tenant Media Engine

V-Stream is a distributed video ingestion and streaming pipeline built to handle high-concurrency workloads. Engineered with a focus on protecting the Node.js event loop, this project demonstrates real-world architectural patterns including asynchronous task decoupling, multi-tenant data isolation, and comprehensive system observability.

---

## 🏗️ System Architecture

```mermaid
graph TD
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef mainServer fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px;
    classDef worker fill:#e8f5e9,stroke:#43a047,stroke-width:2px;
    classDef broker fill:#fff3e0,stroke:#fb8c00,stroke-width:2px;
    classDef storage fill:#eceff1,stroke:#607d8b,stroke-width:2px;
    classDef metrics fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px;

    subgraph Client_Layer [Client Layer]
        Client[Client Browser / App]:::client
    end

    subgraph API_Observability [API and Observability]
        API[Node.js API Server<br/>Express + Socket.io]:::mainServer
        Login[Bcrypt Auth CPU Bound]:::mainServer
        Prometheus[(Prometheus / Grafana<br/>Metrics)]:::metrics

        API -->|1. Sync Call| Login
        API -.->|2. Expose metrics| Prometheus
    end

    subgraph Message_Broker [Message Broker]
        Redis[(Redis + BullMQ)]:::broker
    end

    subgraph Worker_Layer [Async Workers]
        Worker[Standalone Node.js Worker]:::worker
        AI[AI Analysis Module]:::worker

        Worker -->|6. Execute| AI
    end

    subgraph Data_External [Storage and Services]
        DB[(PostgreSQL/MongoDB)]:::storage
        Cloudinary[Cloudinary CDN]:::storage
    end

    Client -->|A. Login / View / Upload| API
    API -->|3. Push Job| Redis
    Redis -->|4. Pull Job| Worker
    Worker -->|5. Process Video| Cloudinary
    Worker -->|7. Update Status| DB

    Worker -.->|8. Emit Progress| Redis
    Redis -.->|9. Events| API
    API -.->|F. Realtime Updates| Client
```

---

## 🚀 Engineering Impact & Bottlenecks Solved

### Decoupled Heavy Workloads
Profiled using autocannon; CPU-heavy tasks pushed latency to **8.4s**. Solved via **BullMQ + Redis background jobs**.

### Preserved API Responsiveness
Separated API and Worker → maintained **~25ms response time under load**.

### Data-Driven Observability
- Prometheus metrics
- Grafana dashboards
- Pino structured logs
- Tenant-aware tracing

### Strict Multi-Tenancy
Secure isolation ensuring **Organization-level data separation**.

---

## 💻 Tech Stack

- **Backend:** Node.js, Express, Socket.io  
- **Queue:** Redis, BullMQ  
- **Observability:** Prometheus, Grafana, Pino  
- **Database:** MongoDB / PostgreSQL  
- **Storage/CDN:** Cloudinary  
- **Frontend:** React, Vite, Tailwind CSS  

---

## ⚙️ Local Development Setup

### 1. Environment Variables

```
PORT=8000
NODE_ENV=development

MONGO_URI=your_db_uri
REDIS_URI=redis://localhost:6379

CLOUDINARY_CLOUD_NAME=your_name  
CLOUDINARY_API_KEY=your_key  
CLOUDINARY_API_SECRET=your_secret  

JWT_SECRET=your_super_secret_key
```

---

### 2. Run Services

```
npm install

# API
npm run dev:api

# Worker
npm run dev:worker

# Frontend
cd frontend && npm run dev
```

---

### 3. Load Testing

```
npm run test:load
```

Monitor `/metrics` endpoint.

---

## 🛣️ Roadmap (Phase 3)

- Circuit Breakers (opossum)
- Idempotency Keys
- Distributed Rate Limiting

---

## 👨‍💻 Author

**Saurabh Kumar Jha**
