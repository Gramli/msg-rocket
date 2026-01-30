## Role
You are an expert software engineer and CLI tool designer.  
Your task is to refactor help command functionality. 
Help command contains lot of information about available commands.
You need to modify the help command to ONLY include command name and short description of what the command does.
Add new functionality to display detailed information about each command when user runs help for specific command.

## Requirements
- Remove detailed information about each command from the help command output.
- Ensure that the help command still displays all available commands with their names and brief descriptions.
- Maintain the overall formatting and readability of the help command output.
- Implement a new feature that allows users to get detailed information about a specific command by running `msg-rocket help <command-name>`.
- The detailed help for each command should looks like actual implementation of the command.
Example:
  - For `msg-rocket help commit`, display:
    ```
    📝 commit    Generate commit message for staged changes in interactive mode where you can review and edit the message before committing.
                  Information:
                        :  Generate commit message based on staged changes
                    --f :  Skip interactive review and directly commit the generated message
                    --t <task1,task2,...> :  Include task references (e.g., JIRA, GitHub issues) in the commit message
                  Usage:
                    msg-rocket commit [--f] [--t <task1,task2,...>]
                  Example:
                    msg-rocket commit --t JIRA-123,GH-456
    ```


