# Layman - Talk to Your App

A chat-first interface that lets anyone talk to their app. Understand flows, APIs, logic, and dependencies in plain language.

## Vision

Layman is a chat-first interface that lets anyone talk to their app. It feels like ChatGPT but is specifically designed to help non-technical users (PMs, designers, execs, support) understand how applications work by:

- Understanding flows, APIs, logic, and dependencies
- Diagnosing bugs, inputs/outputs, and error states
- Seeing impacts of changes
- Estimating effort and complexity
- Generating specs, user stories, and diagrams

## Features

### MVP Features
- ✅ Chat interface with typing/loading animations
- ✅ OpenAI integration for intelligent responses
- ✅ Clarifying questions to understand vague inputs
- ✅ Modern, premium design (Notion/Airbnb style)
- ✅ Subtle micro-animations and smooth transitions

### Coming Soon
- 🔄 Source ingestion (GitHub repos, local code, OpenAPI files)
- 🔄 Code parsing and knowledge graph
- 🔄 Auto-generated diagrams (flow, dependency, sequence)
- 🔄 Citations to relevant code files and APIs
- 🔄 Export to Markdown
- 🔄 Feedback system (thumbs up/down)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/thejoseplatero/layman.git
cd layman
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# GitHub OAuth (for future repo integration)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Database (for future knowledge graph)
DATABASE_URL=your_database_url_here
```

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + OpenAI API
- **UI**: Framer Motion + Lucide React
- **Styling**: Tailwind CSS + Custom animations

## Usage Examples

### Role-based Examples

**PM**: "What happens if we add loyalty tier to checkout?" 
→ flows, APIs, dependencies, estimate

**Designer**: "What data fills this screen?" 
→ APIs, inputs/outputs, error states, diagram

**Support**: "Seat selection failed — why?" 
→ traces flow, shows likely causes

**Exec**: "Why does this feature take 3 months?" 
→ effort drivers, complexity factors, unknowns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] GitHub repository integration
- [ ] Local codebase upload
- [ ] OpenAPI/Swagger file parsing
- [ ] Knowledge graph generation
- [ ] Diagram generation (Mermaid.js)
- [ ] Citation system
- [ ] Export functionality
- [ ] Feedback system
- [ ] User authentication
- [ ] Multi-project support
