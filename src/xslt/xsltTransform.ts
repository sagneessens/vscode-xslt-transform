import {window, workspace} from "vscode";
import { run } from "mocha";
import { executeXSLTTransformCommand } from "./commandHandler";

export interface XSLTTransformation {
    xml: string;
    xslt: string;
    processor: string;
}

export async function runXSLTTransformation(): Promise<void> {
    let configuration = workspace.getConfiguration("xslt");
    let processor = configuration.get<string>("processor");

    if (processor === undefined) {
        window.showErrorMessage("No xslt processor configured");
        return;
    }

    if (window.activeTextEditor === undefined) {
        window.showErrorMessage("No valid xml file opened");
        return;
    }

    let xml = window.activeTextEditor.document.getText();

    let xsltFile = await window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
            "xslt": ["xsl", "xslt"]
        }
    });

    if (xsltFile === undefined) {
        window.showErrorMessage("No valid xslt file");
        return;
    }

    const xsltTransformation: XSLTTransformation = {
        xml: xml,
        xslt: xsltFile[0].fsPath,
        processor: processor
    };

    await executeXSLTTransformCommand(xsltTransformation);
}