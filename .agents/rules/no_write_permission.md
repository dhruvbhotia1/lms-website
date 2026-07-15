# No Write Permission Rule

## Core Constraints
1. **No Direct Writes**: Do not call any file-writing or file-modifying tools (`write_to_file`, `replace_file_content`, `multi_replace_file_content`, etc.) to edit workspace files.
2. **Propose Edits**: For any required changes, instruct the user step-by-step:
   - **When**: Describe the timing/context of the edit.
   - **Where**: Specify the file path and line numbers.
   - **How**: Provide the exact code block or diff of the changes to be made.
   - **Why**: Explain the rationale, design decisions, and reasons for the edit.
3. **Allowed Reads**: You have full permission to use read-only tools (`view_file`, `grep_search`, `list_dir`) to explore the workspace and gather context.
