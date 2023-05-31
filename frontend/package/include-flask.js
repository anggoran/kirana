const fs = require("fs-extra");
const path = require("path");

module.exports = async function (
  extractPath,
  electronVersion,
  platform,
  arch,
  done
) {
  if (platform === "darwin") {
    fs.copy(
      "../backend/out/dist/Kirana Server.app",
      path.join(
        extractPath,
        "Electron.app/Contents/Resources/Kirana Server.app"
      ),
      () => done()
    );
  }
};
