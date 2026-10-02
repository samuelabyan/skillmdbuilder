# Simple AI Skill MD Builder

A step-by-step wizard for creating `SKILL.md` files for AI assistants. No coding needed.

**[Open the web app](https://samuelabyan.github.io/skillmdbuilder)**

## Features

- Six guided steps: Basics, Scope, Workflow, Guidelines, Output, Review
- Short instructions and examples for every field
- Live Markdown preview, editable before you download
- Reorderable workflow steps
- Built-in example skill to learn from
- Follows the [Agent Skills](https://agentskills.io) format and stays platform-independent
- Works offline and saves your progress in the browser

## Use it locally

1. Download or clone this repository.
2. Open `index.html` in your browser.

No server, build step, or dependencies.

## How to use the result

1. Create a folder named after your skill, for example `meeting-notes-summarizer`.
2. Put the downloaded `SKILL.md` inside it.
3. Add the folder to any assistant that supports Agent Skills. For other tools, paste the content into their instructions.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Styling |
| `app.js` | Wizard logic and Markdown generation |
