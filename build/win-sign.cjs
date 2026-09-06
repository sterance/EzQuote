const path = require("path");
const { doSign } = require("app-builder-lib/out/codeSign/windowsCodeSign");

/**
 * @type {import("electron-builder").CustomWindowsSign}
 */
module.exports = async function sign(configuration, packager) {
  if (!configuration.cscInfo) {
    return;
  }

  // Skip the NSIS elevate.exe helper
  if (configuration.path.endsWith("elevate.exe")) {
    return;
  }

  await doSign(configuration, packager);
};
