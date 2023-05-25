module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
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
          {
            entry: "electron/preload.ts",
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
