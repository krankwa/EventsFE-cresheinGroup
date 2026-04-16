# EventTix Frontend 🎟️

A premium, modern Event Booking and Management platform built with **React** and **Vite**. EventTix provides a sleek user interface for discovering events, managing ticket purchases, and organizing events for administrators.

---

## 🔄 Application Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Vercel as Vercel (Frontend)
    participant Azure as Azure (Backend API)
    participant SB as Supabase (Storage/DB)

    User->>Vercel: Accessible via Browser
    Vercel->>Azure: API Request (JWT Auth)
    Azure-->>Vercel: JSON Data
    Vercel->>User: Render UI
    
    Note over User,Azure: Image Upload Flow
    User->>Vercel: Select Image
    Vercel->>Azure: Upload File (Admin Token)
    Azure->>SB: Proxy Upload to Bucket
    SB-->>Azure: Public URL
    Azure-->>Vercel: Success + URL
```

---

## 🔄 Developer Iteration Workflow (Agile)

This diagram outlines the typical Agile developer lifecycle when implementing new features or fixes across the full stack.

```mermaid
graph TD
    subgraph "Agile Planning"
        backlog[Sprint Backlog / User Stories]
        daily[Daily Standup / Tasks]
    end

    backlog --> daily

    subgraph "Dev Cycle"
        db_mod[1. DB: Migrations / SQL Schema]
        be_mod[2. BE: API Controllers / Core Logic]
        fe_mod[3. FE: React Components / Services]
    end

    daily --> db_mod
    db_mod --> be_mod
    be_mod --> fe_mod
    fe_mod --> review{Sprint Review / Iterate?}
    
    subgraph "Git Sync & Conflict Resolution"
        review -- "Done" --> git_commit[4. Git: Stage & Commit]
        git_commit --> git_pull[5. Git: Pull & Sync Remote]
        git_pull --> conflict_check{Conflicts?}
        conflict_check -- "Yes" --> resolve[Manual Merge / Resolve]
        resolve --> git_commit
        conflict_check -- "No" --> git_push[6. Git Push: Trigger CI/CD]
    end

    review -- "Feedback" --> daily
    git_push --> pipeline([Vercel & Azure Pipelines])

    %% Styling
    style resolve fill:#f66,stroke:#333
    style git_push fill:#3ecf8e,color:#fff,stroke:#333
    style backlog fill:#ff9,stroke:#333
    style daily fill:#ff9,stroke:#333
    style db_mod fill:#0078d4,color:#fff,stroke:#333
    style be_mod fill:#0078d4,color:#fff,stroke:#333
    style fe_mod fill:#0078d4,color:#fff,stroke:#333
```

### Workflow Steps:
1.  **Agile Planning**: Tasks are pulled from the **Sprint Backlog**. Progress is tracked via daily standups.
2.  **Database**: First, define or update the schema using EF Core migrations or raw SQL scripts (found in the backend repository).
3.  **Backend (BE)**: Implement the business logic and expose it via API Controllers.
4.  **Frontend (FE)**: Update the TanStack Query services and React components to consume the new API endpoints.
5.  **Review**: Sprint Review or Peer Review ensures the feature meets requirements. Feedback may trigger further iterations.
6.  **Git Sync**: Always pull before pushing to handle potential **Merge Conflicts** early. If a conflict occurs, resolve it manually, re-test locally, and then proceed with the final push to trigger the deployment.

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Maps**: [Leaflet](https://leafletjs.com/)
- **Components**: Radix UI primitives & Lucide icons

---

## 🚀 Key Features
- **Dynamic Event Discovery**: Interactive event lists with search and category filtering.
- **Secure Ticketing**: Multi-tier ticket selection and QR code generation for tickets.
- **Admin Dashboard**: Comprehensive dashboard for event creators to manage venues and sales.
- **Image Uploads**: Integrated image management via a secure backend proxy.
- **Responsive Design**: Mobile-first approach for seamless booking on any device.

---

## ⚙️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configuration (`.env`)
Create a `.env` file in the root directory and add the following variables:

| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_API` | The base URL of your .NET API (e.g., `https://api.yourdomain.com/api`). |
| `VITE_SUPABASE_URL` | Your Supabase project URL (used for public asset resolution). |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key. |

### 3. Running Locally
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 🔐 Deployment (Vercel)

### Building for Production
Vite bakes environment variables into the bundle at build time. Ensure your environment variables are configured in the Vercel Dashboard before deployment.

1.  Push your code to GitHub.
2.  Connect your repository to **Vercel**.
3.  Add the `VITE_` variables in **Settings > Environment Variables**.
4.  Vercel will automatically build and deploy the production bundle.

---

## ⚠️ Things to Watch Out For

> [!WARNING]
> - **CORS**: Ensure your Vercel deployment URL is added to the backend's allowed origins list.
> - **Environment Prefixes**: All variables must start with `VITE_` to be accessible in the client-side code.
> - **Build Cache**: If you update environment variables in Vercel, you must trigger a **Redeploy** to bake the new values into the JS files.

---

## 🖌️ Design System
This project uses **Shadcn/UI** for a consistent and premium look. 
- Use `npm run format` to ensure code style consistency with Prettier.
- Theme colors and tokens are managed in `index.css`.
