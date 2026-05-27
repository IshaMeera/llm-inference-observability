# Architecture Notes

## Ingestion Flow

Frontend
→ Chat Service
→ Provider
→ trackInference
→ Ingestion API
→ MongoDB

## Logging Strategy

Near real-time metadata collection.

Captured:
- provider
- model
- latency
- token usage
- previews
- status

## Scaling Considerations

Current:
- monolith services
- synchronous ingestion

Future:
- queues
- workers
- distributed tracing

## Failure Handling

- ingestion non-blocking
- retries possible
- logs stored best effort

## Architecture Notes
## Architectural Style

The platform follows a service-oriented architecture with clear separation between:

Presentation Layer → Frontend (React / Next.js)
Application Layer → Chatbot Service
Provider Layer → LLM Provider Abstraction
Observability Layer → Inference Wrapper
Data Ingestion Layer → Ingestion Service
Persistence Layer → MongoDB

This separation allows conversational functionality and observability concerns to evolve independently.

## Request Lifecycle
1. User Interaction

Users send prompts from the frontend chat interface.

Frontend is responsible for:

rendering conversation state
streaming responses
maintaining active session context
displaying analytics
2. Chat Processing

The Chatbot Service acts as the orchestration layer.

Responsibilities:

receive user requests
restore conversation context
select provider
initiate streaming
return generated output

The chatbot service does not directly persist analytics data.

3. Provider Abstraction

A provider factory abstracts provider-specific implementations.

Current providers:

Gemini
Grok

Benefits:

interchangeable providers
reduced vendor lock-in
unified interface
simplified future provider additions

Example abstraction:

generate(messages, metadata)
4. Inference Instrumentation

Inference execution is wrapped using:

trackInference()

Responsibilities:

measure latency
collect metadata
capture token usage
detect failures
apply PII redaction
forward logs to ingestion

Instrumentation remains external to provider logic.

5. Data Ingestion

Observability data is sent to the ingestion service.

Responsibilities:

validate payloads
transform metadata
persist logs
isolate storage concerns

The ingestion service operates independently from user response delivery.

6. Persistence Strategy

Two collections are maintained.

chats

Stores:

session history
message ordering
conversation recovery

Used for:

resume conversation
multi-turn context
inference_logs

Stores:

inference metrics
provider behavior
request outcomes

Used for:

dashboards
debugging
observability

Operational logs are intentionally separated from user conversations.

Streaming Architecture

Streaming responses use SSE.

Flow:

Frontend
   ↓
Chatbot Service
   ↓
Provider Stream
   ↓
Chunk Aggregation
   ↓
trackInference()
   ↓
Ingestion

Observability events are emitted after stream completion because final metrics become available only when generation ends.

Reliability Decisions

Current reliability model:

ingestion failures are non-blocking
inference completion takes priority
analytics are best effort
failed requests remain observable

This prevents monitoring outages from affecting user interactions.

Extensibility

The architecture is designed to support:

additional LLM providers
async ingestion pipelines
queue systems
distributed tracing
horizontal scaling

Minimal changes are required outside provider adapters and ingestion infrastructure.