# Mermaid Diagram Templates

Use one of these under "What is this?" in `readme-template.md`, in place of `{{ARCHITECTURE_DIAGRAM}}`, only when the repo has enough distinct components to make a diagram informative — skip it for single-file utilities. Adapt the template rather than starting from scratch.

**Web app (client/server/db):**
```mermaid
flowchart LR
    Client[Browser] --> API[API Server]
    API --> DB[(Database)]
    API --> Cache[(Cache)]
```

**CLI tool:**
```mermaid
flowchart LR
    Input[CLI Args / stdin] --> Parse[Parse & Validate]
    Parse --> Process[Core Logic]
    Process --> Output[stdout / file]
```

**Monorepo package graph:**
```mermaid
flowchart TD
    App[apps/web] --> UI[packages/ui]
    App --> Utils[packages/utils]
    Worker[apps/worker] --> Utils
    UI --> Tokens[packages/design-tokens]
```

**Microservices:**
```mermaid
flowchart LR
    Client --> Gateway[API Gateway]
    Gateway --> Auth[Auth Service]
    Gateway --> Orders[Orders Service]
    Orders --> Queue[[Message Queue]]
    Queue --> Notify[Notification Service]
    Orders --> DB[(Orders DB)]
```

**Library/SDK consumer flow:**
```mermaid
flowchart LR
    App[Your App] --> SDK[This Library]
    SDK --> API[Upstream API]
```
