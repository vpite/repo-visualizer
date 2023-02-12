import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";

import { processDir } from "./process-dir.js";
import { Tree } from "./Tree.tsx";

const main = async () => {
  const outputFile = "./diagram.svg";
  const rootPath = ""; // Micro and minimatch do not support paths starting with ./
  const maxDepth = 9;
  const customFileColors = JSON.parse("{}");
  const colorEncoding = "type";
  const commitMessage = "Repo visualizer: update diagram";
  const excludedPathsString =
    "node_modules,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.git,.vscode,package-lock.json,yarn.lock";
  const excludedPaths = excludedPathsString.split(",").map((str) => str.trim());

  // Split on semicolons instead of commas since ',' are allowed in globs, but ';' are not + are not permitted in file/folder names.
  const excludedGlobsString = "";
  const excludedGlobs = excludedGlobsString.split(";");

  const data = await processDir(rootPath, excludedPaths, excludedGlobs);

  const componentCodeString = ReactDOMServer.renderToStaticMarkup(
    <Tree
      data={data}
      maxDepth={+maxDepth}
      colorEncoding={colorEncoding}
      customFileColors={customFileColors}
    />
  );

  await fs.writeFileSync(outputFile, componentCodeString);

  console.log("All set!");
};

main().catch((e) => {
  console.error(e);
});
