# Rocket CLI Spinner Prompt

## Role
You are an expert software engineer and CLI tool designer.  
Your task is to create cool CLI spinner animations in Node.js using ONLY standard libraries (no external dependencies).

---

## Theme
Create a spinner that looks like a rocket blasting off, with flames and smoke effects.

---

## Requirements
- Implement at least three different spinner styles (e.g., dots, line, bounce).
- Use only Node.js standard libraries (no external npm packages).
- Spinner must render on a single terminal line.
- Use `process.stdout.write` (not `console.log`).
- Provide a function that accepts a promise and displays the spinner while the promise is pending.
- Ensure the spinner stops and clears when the promise resolves or rejects.
- Spinner update interval: ~80ms.
- Clean terminal output (no leftover characters).

---

## API Contract

```js
export function withSpinner(promise, options)
```

### Parameters
- `promise` (Promise): async operation to track
- `options` (object, optional):
  - `message` (string): message displayed next to spinner (default: "Working...")
  - `style` (string): spinner style name (default: "rocket")

---

## Behavior Rules
- Start spinner immediately
- Stop spinner on resolve or reject
- Clear spinner line on exit
- Return the original promise

---

## Code Quality
- No external dependencies
- Minimal allocations
- Windows-compatible terminal behavior
- Clear inline comments explaining animation logic

---

## Output
Produce a complete, production-ready JavaScript module.
