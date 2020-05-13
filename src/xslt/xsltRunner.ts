import {ChildProcess, spawn} from "child_process";
import {ViewColumn, window, workspace} from "vscode";
import {xsltOutputChannel} from "./xsltOutputChannel";

export class Runner {

    private _process: ChildProcess | undefined;
    private _chunks: Array<Buffer> = [];

    public runXSLTTtransformationCommand(command: string, args: string[], xml: string, cwd?: string) {
        xsltOutputChannel.clear();
        xsltOutputChannel.show();

        this._process = spawn(command, args, {cwd: cwd, shell: true});

        this._process.stdin.end(xml, () => {
            xsltOutputChannel.append("file contents written to stdin");
        });

        this._process.stdout.on('data', (data) => {
            this._chunks.push(data);
        });

        this._process.stderr.on('data', (data) => {
            xsltOutputChannel.append(data.toString());
        });

        this._process.on("exit", async (code) => {
            if (code === 0) {
                window.showInformationMessage("XSLT transformation successfully executed.");
                try {
                    const xmlDocument = await workspace.openTextDocument({
                        content: Buffer.concat(this._chunks).toString(),
                        language: "xml"
                    });
                    window.showTextDocument(xmlDocument, ViewColumn.Beside);
                } catch (e) {
                    window.showErrorMessage("Failed to show output in a new document");
                    console.error(e);
                }
            } else if (code === 1) {
                window.showInformationMessage("XSLT transformation failed.");
            }
        });
    }
}
