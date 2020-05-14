import {workspace} from "vscode";
import {Runner} from "./xsltRunner";
import * as path from 'path';
import { XSLTTransformation } from "./xsltTransform";

export async function executeXSLTTransformCommand(transformation: XSLTTransformation) {
    let args = getXSLTTransformCommandArgs(transformation);
    let cwd: string | undefined;
    if (workspace.workspaceFolders) {
        cwd = path.join(workspace.workspaceFolders[0].uri.fsPath);
    }

    let commandRunner: Runner = new Runner();
    commandRunner.runXSLTTtransformationCommand("java", args, transformation.xml, cwd);
}

function getXSLTTransformCommandArgs(transformation: XSLTTransformation): string[] {
    return [
        "-jar",
        `"${transformation.processor}"`,
        "-s:-",
        `-xsl:"${transformation.xslt}"`
    ];
}