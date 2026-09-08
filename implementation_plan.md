# Authentication Session Separation

RequestFeedback: true

- Store customer, supplier, and admin sessions independently.
- Keep the most recently authenticated session active in the UI.
- Restore another valid session when the active role signs out.
- Validate with the frontend production build.
