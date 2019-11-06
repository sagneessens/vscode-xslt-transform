import {ChildProcess, spawn} from "child_process";
import {ViewColumn, window, workspace} from "vscode";
import {xsltOutputChannel} from "./xsltOutputChannel";

export class Runner {

    private _process: ChildProcess | undefined;

    public runCommand(command: string, args: string[], data: string, cwd?: string) {
        xsltOutputChannel.clear();
        xsltOutputChannel.show();

        this._process = spawn(command, args, {cwd: cwd, shell: true});

        this._process.stdin.end(data, async () => {
            xsltOutputChannel.append("file contents written to stdin");
        });

        this._process.stdout.on('data', async (data) => {
            try {
                const xmlDocument = await workspace.openTextDocument({
                    content: data.toString(),
                    language: "xml"
                });
                window.showTextDocument(xmlDocument, ViewColumn.Beside);
            } catch(e) {
                window.showErrorMessage("Failed to show output in a new document");
                console.error(e);
                xsltOutputChannel.append(data.toString());
            }
        });

        this._process.stderr.on('data', (data) => {
            xsltOutputChannel.append(data.toString());
        });

        this._process.on("exit", (code) => {
            if (code === 0) {
                window.showInformationMessage("XSLT transformation successfully executed.");
            } else if (code === 1) {
                window.showInformationMessage("XSLT transformation failed.");
            }
        });
    }

    public runXSLTTtransformationCommand(command: string, xml: string, cwd?: string) {
        this.runCommand(command, [], xml, cwd);
    }
}
