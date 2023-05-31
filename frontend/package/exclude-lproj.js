const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

module.exports = async function (
  extractPath,
  electronVersion,
  platform,
  arch,
  done
) {
  if (platform === "darwin") {
    const cwd = path.join(extractPath, "..");
    const lprojs = glob.sync("*.lproj", { cwd });
    const pathsToRemove = lprojs
      .map((dir) => path.join(cwd, dir))
      .filter((filePath) => path.extname(filePath) === ".lproj");
    await Promise.all(pathsToRemove.map((filePath) => fs.remove(filePath)));
    done();
  }
};
