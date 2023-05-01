import Image from "@tiptap/extension-image";
import { Plugin } from "@tiptap/pm/state";

const CustomImage = Image.extend({
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
        getAttrs(node) {
          if (node instanceof HTMLImageElement) {
            return {
              src: node.getAttribute("src"),
              alt: node.getAttribute("alt"),
              title: node.getAttribute("title"),
            };
          }
          return {};
        },
      },
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste(view, event) {
              if (!event.clipboardData) return;

              const files = Array.from(event.clipboardData.files);
              if (files.length === 0) return;

              files.forEach((file) => {
                const { name, type, size } = file;
                console.log(file);
              });
            },
            drop(view, event) {
              console.log({ view, event });
            },
          },
        },
      }),
    ];
  },
});

export default CustomImage;
