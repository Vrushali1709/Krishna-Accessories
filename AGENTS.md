# Antigravity Workspace Rules & Settings

## Approval and Review Policy (Accept / Reject)

1. **Mandatory User Approval Before Execution**:
   - The agent MUST ALWAYS present clear **Accept** and **Reject** options before applying changes or executing modifications.
   - For any multi-step task, feature implementation, or file change, the agent MUST generate an `implementation_plan.md` with `RequestFeedback: true` to provide interactive **Proceed / Reject** controls.

2. **No Unsolicited Code Changes**:
   - Do NOT edit or modify source code files without prior confirmation and approval from the user.
   - Always wait for the user to click **Proceed** or explicitly confirm before applying changes.

3. **Interactive Decision Prompts**:
   - When asking for design feedback, direction, or user decisions, always present explicit choices including "Accept" and "Reject" / "Skip".
