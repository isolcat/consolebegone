# ConsoleBeGone - VS Code Extension

## Description
**ConsoleBeGone** is a highly efficient Visual Studio Code extension designed to enhance your coding experience, especially when dealing with JavaScript, TypeScript, JSX, and TSX files. This extension automatically detects `console` log statements in your code and highlights them with distinct visual decorations. This feature assists developers in quickly identifying and removing debug lines before pushing the code to production, thereby maintaining clean and professional code quality.

## Features
- **Automatic Detection**: Instantly detects `console` log calls when you save JavaScript, TypeScript, JSX, and TSX files.
- **Visual Decorations**: Highlights `console` log calls with a solid border and distinct background color to make them stand out in your code.
- **Workspace-wide Check**: Includes a command `consolebegone.checkWorkspace` to check for `console` log calls across your entire workspace, ensuring no debug line is left behind.
- **Customizable Appearance**: Despite having a default styling, decorations can be customized to fit various themes or personal preferences.

## How to Use
1. **Installation**: Simply install the extension from the Visual Studio Code Marketplace.
2. **On Save**: The extension automatically highlights `console` log calls in your code upon saving files.
3. **Manual Check**: Use the command `consolebegone.checkWorkspace` from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) to scan your entire workspace for `console` log calls.
4. **View Decorations**: Once detected, `console` logs will be visually decorated, making them easy to identify.

## Why ConsoleBeGone?
ConsoleBeGone tackles the common issue of leftover `console` logs in production code. It saves time and effort in code reviews and helps maintain a clean codebase, making it an essential tool for both individual developers and teams.

## Feedback and Contributions
Your feedback is valuable in making ConsoleBeGone more effective. Feel free to contribute or report issues on our GitHub repository.
