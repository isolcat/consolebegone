const vscode = require('vscode');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

let consoleLogDecorationType;
let consoleLogTextDecorationType;

function activate(context) {

    // 初始化装饰类型
    consoleLogDecorationType = vscode.window.createTextEditorDecorationType({
			borderWidth: '1px',
			borderStyle: 'solid',
			overviewRulerColor: 'red',
			overviewRulerLane: vscode.OverviewRulerLane.Right,
			light: {
					borderColor: 'red',
			},
			dark: {
					borderColor: 'yellow',
			}
	});

    consoleLogTextDecorationType = vscode.window.createTextEditorDecorationType({
        isWholeLine: true,
        after: {
            margin: '0 0 0 3em',
            color: 'rgba(128, 128, 128, 0.7)',
            contentText: '⚠️ 需要移除的 console 调用',
            fontWeight: 'normal'
        }
    });

    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
        if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(document.languageId)) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document === document) {
                updateDecorations(editor);
            }
        }
    }));

    let disposable = vscode.commands.registerCommand('consolebegone.checkWorkspace', function () {
        checkWorkspaceForConsole();
    });

    context.subscriptions.push(disposable);
}

function updateDecorations(editor) {
    const text = editor.document.getText();
    const ast = parser.parse(text, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });

    traverseASTAndMarkConsoleCalls(ast, editor);
}

function traverseASTAndMarkConsoleCalls(ast, editor) {
    const consoleNodes = [];

    traverse(ast, {
        MemberExpression(path) {
            if (
                path.node.object &&
                path.node.object.name === 'console' &&
                path.parent.type === 'CallExpression'
            ) {
                consoleNodes.push(path.parent);
            }
        }
    });

    const colorDecorations = consoleNodes.map(node => {
        const startPos = editor.document.positionAt(node.start);
        const endPos = editor.document.positionAt(node.end);
        return { range: new vscode.Range(startPos, endPos) };
    });

    const textDecorations = consoleNodes.map(node => {
        const startPos = editor.document.positionAt(node.start);
        return { range: new vscode.Range(startPos, startPos) };
    });

    editor.setDecorations(consoleLogDecorationType, colorDecorations);
    editor.setDecorations(consoleLogTextDecorationType, textDecorations);
}

function checkWorkspaceForConsole() {
    vscode.workspace.findFiles('{**/*.js,**/*.ts,**/*.jsx,**/*.tsx}', '**/node_modules/**').then((files) => {
        files.forEach((file) => {
            vscode.workspace.openTextDocument(file).then((document) => {
                const text = document.getText();
                const ast = parser.parse(text, {
                    sourceType: 'module',
                    plugins: ['jsx', 'typescript']
                });

                traverseASTAndFindConsole(ast, file);
            });
        });
    });
}

function traverseASTAndFindConsole(ast, file) {
    let hasConsole = false;

    traverse(ast, {
        CallExpression(path) {
            if (
                path.node.callee.object &&
                path.node.callee.object.name === 'console'
            ) {
                hasConsole = true;
            }
        }
    });

    if (hasConsole) {
        vscode.window.showWarningMessage(`Console 调用在文件中找到: ${file.fsPath}`);
    }
}

function deactivate() {
    if (consoleLogDecorationType) {
        consoleLogDecorationType.dispose();
    }
    if (consoleLogTextDecorationType) {
        consoleLogTextDecorationType.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
