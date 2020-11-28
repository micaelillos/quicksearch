import * as vscode from 'vscode';
import fetch from 'node-fetch';
import {uploadSnippet, baseURL} from './Globals'

export const upload = (content : uploadSnippet) => {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Uploading Code Snippet",
        cancellable: true
    }, async (progress, token) => {
        token.onCancellationRequested(() => {
            console.log("User canceled the long running operation");
        });
        progress.report({ increment: 0 });

        setTimeout(() => {
            progress.report({ increment: 30, message: "Pushing to server" });
        }, 1500);

        setTimeout(() => {
            progress.report({ increment: 50, message: "Finishing Touches" });
        }, 1000);

        setTimeout(() => {
            progress.report({ increment: 20, message: "Nearly Done.." });
        }, 3000);

        // call api
        await fetch(`${baseURL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                answer: content.answer,
                search:content.search
            }),
        })

        const p = new Promise(resolve => {
            setTimeout(() => {
                resolve('done');
            }, 300);
            progress.report({ message: "Added successfully", increment: 0 })
        });


        return p;
    });
}

export const callApi = async (text: string, editor: vscode.TextEditor) => {
    const response = await fetch(`${baseURL}/search?text=${text}`)
    const data = await response.text();
    console.log("response", response)
    if (!response) return vscode.window.showErrorMessage('An Error has occured');


    editor.edit((edit) => {
        const position = editor.selection.active;
        if (!position) return vscode.window.showErrorMessage('NO cursor');
        if (!data)
            edit.insert(position, 'No Results');
        else
            edit.insert(position, data);

    })
    vscode.window.showInformationMessage(!response ? 'No results' : 'Successfully Quick Searched');
}