# Rule: Require Safeword 'AGY_PERMIT_EDIT' for File Modifications

## Constraint
Do NOT edit, create, or modify any project files (including via `replace_file_content`, `multi_replace_file_content`, `write_to_file`, or terminal commands that write/modify files) UNLESS the user prompt explicitly includes the safeword:

`AGY_PERMIT_EDIT`

## Behavioral Guidelines
1. **Without `AGY_PERMIT_EDIT`**:
   - Perform read-only research, viewing, debugging, and code analysis.
   - Explain issues and present recommended code changes in markdown code blocks within the chat response.
   - Do NOT execute file write/edit tool calls.

2. **With `AGY_PERMIT_EDIT`**:
   - Authorized to create, edit, and update files as requested.
