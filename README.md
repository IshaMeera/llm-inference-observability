# LLM Inference Observability Platform

A lightweight LLM observability and ingestion system built around a multi-provider chatbot architecture.

The platform captures inference metadata in near real time, stores conversation history, and exposes analytics for monitoring latency, throughput, provider usage, and errors.

---

## Features

### Chatbot Application
- Multi-turn conversations
- Session-based conversation history
- Streaming responses (SSE)
- Chat-style UI
- Context retention

### Multi Provider Support
- Gemini
- Grok
- Provider abstraction layer

### Inference Observability
- Latency tracking
- Token usage tracking
- Provider tracking
- Request status tracking
- Input/output previews
- Session tracking
- Error logging

### Ingestion Pipeline
- Log ingestion API
- Chat ingestion API
- Metadata extraction
- MongoDB storage

### Dashboard
- Total requests
- Latency visualization
- Throughput metrics
- Error tracking
- Provider usage analytics
- Auto refresh

### Additional Features
- PII redaction
- Docker Compose setup
- Streaming support
- Session storage
- Cancel and Resume conversation

---

# Architecture Overview

Frontend (React / Next.js)

↓

Chatbot Service

↓

Provider Factory

↓

LLM Provider (Gemini / Grok)

↓

Inference Wrapper (trackInference)

↓

Ingestion Service

↓

MongoDB

---

# Setup Instructions

## Prerequisites

- Node.js 20+
- Docker
- Docker Compose
- MongoDB

---

## Environment Variables

### chatbot-service

```env
PORT=5000

GEMINI_API_KEY=

GROK_API_KEY=

INGESTION_SERVICE_URL=http://ingestion:4000/log

CHAT_INGESTION_SERVICE_URL=http://ingestion:4000/chat
```

### ingestion-service

```env
PORT=5002

MONGO_URI=
```

### frontend

```env
NEXT_PUBLIC_CHAT_API=http://localhost:5000
NEXT_PUBLIC_ANALYTICS_API=http://localhost:5001
```

---

## Install

```bash
git clone <repo>

cd project

docker-compose up --build
```

Application:

```text
Frontend:
http://localhost:3000

Chatbot:
http://localhost:5000

Ingestion:
http://localhost:5001
```

---

# API

## Chat

POST /chat

```json
{
 "session":"",
 "message":""
}
```

---

## Streaming

POST /chat/stream

```json
{
 "session":"",
 "message":""
}
```

---

## Logs

POST /log

---

## Analytics

GET /analytics

---

# Schema Design

## chats

```js
{
 sessionId,
 role,
 content,
 sequence,
 timestamps
}
```

Purpose:
- conversation history
- resume support
- session tracking

---

## inference_logs

```js
{
 provider,
 model,
 sessionId,
 latency,
 tokenUsage,
 inputPreview,
 outputPreview,
 status,
 error,
 timestamp
}
```

Purpose:
- observability
- analytics
- debugging
- monitoring

---

# Logging Strategy

Inference logging is implemented using a lightweight wrapper.

Flow:

User Request

↓

trackInference()

↓

Metadata Extraction

↓

Ingestion API

↓

MongoDB

Captured metadata:

- provider
- model
- latency
- token usage
- request status
- timestamps
- session id
- input preview
- output preview

PII redaction is applied before storage.

---

# Tradeoffs Made

### Streaming vs Simplicity

Streaming improves UX but introduces complexity for observability because final output is available only after stream completion.

---

### Separate ingestion service

Improves separation of concerns but adds network overhead.

---

### Preview storage instead of full payloads

Reduces storage growth and lowers privacy exposure.

---

# Scaling Considerations

Current:

- single ingestion service
- synchronous logging
- MongoDB primary storage

Future improvements:

- queue-based ingestion
- Kafka / Redis
- async workers
- horizontal scaling
- caching
- tracing

---

# Failure Handling Assumptions

Current behavior:

- chatbot continues even if ingestion fails
- logs are best effort
- ingestion failures do not block user responses
- failed requests recorded with error metadata

---

# What I Would Improve With More Time

- event-driven ingestion
- Kubernetes deployment
- distributed tracing
- retry queues
- alerting
- provider failover

---