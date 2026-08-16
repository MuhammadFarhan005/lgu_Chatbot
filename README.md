# LGU Admissions Chatbot

This repository contains a simple single-page prototype for an LGU Admissions chatbot. It is a static front-end that loads a knowledge-base (kb.json) and answers user questions using a simple keyword matching algorithm.

Files added:
- index.html — main single-page UI (chat icon in bottom-left, expandable chat panel)
- style.css — styling and theme variables (light/dark with LGU green accent)
- app.js — frontend logic: loads kb.json, matches queries, and renders messages
- kb.json — knowledge base (Q/A pairs and intents) built from LGU admissions pages

How to run:
- Option A (quick): Open `index.html` in your browser (double-click or serve with a static file server).
- Option B (recommended for some browsers): Serve the folder using a simple local server, e.g. `npx http-server` or `python -m http.server` and open `http://localhost:8080`.

Customizing the knowledge base:
- Edit `kb.json` to add program-specific fees, dates, and exact contact details pulled from the official pages.
- For more advanced QA you can replace the matching logic in `app.js` with a vector search or connect to an LLM QA service.

Next steps I can take for you:
1) Pull exact numeric fees, scholarship amounts, merit formula weights, and contact phone/email from the live LGU pages and update `kb.json` with precise data.
2) Improve matching by implementing semantic search (e.g., using embeddings) or connecting to an LLM.
3) Create a backend endpoint to log conversations, handle uploads, and provide secure access to applicant-specific data.

If you want me to open a pull request with these changes applied to the repository, say "Hand this off to the coding agent" and I will create the PR.
