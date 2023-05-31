module.exports = {
  packagerConfig: {
    name: "Kirana",
    appBundleId: "dev.aktivis.kirana",
    asar: true,
    afterExtract: ["./package/include-flask.js"],
    afterPrune: ["./package/exclude-lproj.js"],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        format: "ULFO",
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "electron/main.ts",
            config: "vite.config.js",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.config.js",
          },
        ],
      },
    },
  ],
};
