import * as vscode from 'vscode'

// this method is called when vs code is activated
export function activate (context: vscode.ExtensionContext) {
  // create a decorator type that we use to decorate small numbers
  const nullDecoration = vscode.window.createTextEditorDecorationType({})

  let activeEditor = vscode.window.activeTextEditor
  if (activeEditor) {
    updateDecorations()
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor
      if (editor) {
        updateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  vscode.workspace.onDidChangeTextDocument(
    () => {
      updateDecorations()
    },
    null,
    context.subscriptions
  )

  function updateDecorations () {
    if (!activeEditor) {
      return
    }
    const regEx = /\n/g
    const text = activeEditor.document.getText()
    const newLines: vscode.DecorationOptions[] = []
    let match
    while ((match = regEx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index)
      const endPos = activeEditor.document.positionAt(match.index + 1)
      const decoration: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos), renderOptions : { before : { contentText: "⬎"}} }
      newLines.push(decoration)
    }
    activeEditor.setDecorations(nullDecoration, newLines)
  }
}
