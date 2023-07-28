import { findChildren } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import { Plugin } from "@tiptap/pm/state";

const uploadImage = async (formData: FormData) => {
  const res = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });
  const json = await res.json();

  if (json.url && typeof json.url === "string") return json.url;
  return "";
};

const CustomImageBackend = Image.extend({
  draggable: true,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop(view, event, moved) {
            if (moved) return false;
            if (!event.dataTransfer?.files[0]) return false;

            const file = event.dataTransfer.files[0];
            const formData = new FormData();
            formData.append("image", file);

            uploadImage(formData)
              .then((url) => {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                if (!coordinates) return false;

                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                return view.dispatch(transaction);
              })
              .catch((err) => console.error(err));

            return true;
          },

          handlePaste(view, event) {
            console.log("paste");
            const items = Array.from(event.clipboardData?.items || []);

            for (const item of items) {
              if (item.type.indexOf("image") === 0) {
                const file = item.getAsFile();
                if (!file) return false;

                const formData = new FormData();
                formData.append("image", file);

                uploadImage(formData)
                  .then((url) => {
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: url });
                    const transaction =
                      view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                  })
                  .catch((err) => console.error(err));
              }
            }

            return false;
          },
        },
      }),
    ];
  },
});

export default CustomImageBackend;
