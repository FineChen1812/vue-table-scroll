const title = "vue-table-scroll";
const path = require("path");
module.exports = {
  base: "/vue-table-scroll/",
  locales: {
    "/": {
      lang: "en-US", 
      title,
      description: "A scrollable table",
    },
    "/zh/": {
      lang: "zh-CN",
      title,
      description: "一个可以滚动的表格",
    },
  },
  head: [["link", { rel: "icon", href: `/favicon.ico` }]],
  themeConfig: {
    repo: "https://github.com/NexusFeng/vue-table-scroll.git",
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh",
          },
        },
        algolia: {},
        nav: [
          { text: "Home", link: "/" },
          { text: "Guide", link: "/guide/" },
          { text: "Changelog", link: "/changelog/" },
        ],
        sidebar: {
          "/guide/": [
            {
              title: "Guide",
              collapsable: false,
              children: [
                "",
                "options",
                "event",
              ],
            },
            {
              title: "Examples",
              collapsable: false,
              children: [
                "basic",
                "speed",
                "width",
                "isIndex",
                "bodyHeight",
                "singleStepMove",
                "hidden",
                "lineClick",
                "hoverStop"
              ],
            },
          ],
        },
      },
      "/zh/": {
        selectText: "选择语言",
        label: "简体中文",
        editLinkText: "在 GitHub 上编辑此页",

        algolia: {},
        nav: [
          { text: "主页", link: "/zh/" },
          { text: "指南", link: "/zh/guide/" },
          { text: "更新日志", link: "/zh/changelog/" },
        ],
        sidebar: {
          "/zh/guide/": [
            {
              title: "指南",
              collapsable: false,
              children: [
                "",
                "options",
                "event",
              ],
            },
            {
              title: "示例",
              collapsable: false,
              children: [
                "basic",
                "speed",
                "width",
                "isIndex",
                "bodyHeight",
                "singleStepMove",
                "hidden",
                "lineClick",
                "hoverStop"
              ],
            },
          ],
        },
      },
    },
  },
  dest: "public"
};
