import {workspace} from "vscode";
import {Runner} from "./xsltRunner";
import * as path from 'path';
import { XSLTTransformation } from "./xsltTransform";

export async function executeXSLTTransformCommand(transformation: XSLTTransformation) {
    let cmd = getXSLTTransformCommand(transformation);
    let cwd: string | undefined;
    if (workspace.workspaceFolders) {
        cwd = path.join(workspace.workspaceFolders[0].uri.fsPath);
    }

    let commandRunner: Runner = new Runner();
    commandRunner.runXSLTTtransformationCommand(cmd, cwd);
}

function getXSLTTransformCommand(transformation: XSLTTransformation): string {
    return [
        "java",
        "-jar",
        transformation.processor,
        "-s:-",
        `-xsl:${transformation.xslt}`,
        `<<EOF\n${transformation.xml}\nEOF`
    ].join(" ");
}