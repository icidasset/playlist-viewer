const plugin = require("tailwindcss/plugin")
const kit = require("@fission-suite/kit")


module.exports = {
  mode: "jit",
  darkMode: "media",


  purge: [
    "**/*.html",
    "src/**/*.{js,jsx}",
    ...kit.tailwindPurgeList()
  ],


  theme: {

    colors: {
      ...kit.dasherizeObjectKeys(kit.colors),

      current: "currentColor",
      inherit: "inherit",
      transparent: "transparent",
    },

    fontFamily: kit.fonts,

  },


  plugins: [

    require("@tailwindcss/aspect-ratio"),

    // Add custom font
    plugin(function({ addBase }) {
      kit.fontFaces({ fontsPath: "/fonts/" }).forEach(fontFace => {
        addBase({ "@font-face": fontFace })
      })
    })

  ]

}
