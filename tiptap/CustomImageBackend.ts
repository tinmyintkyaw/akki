import Image from "@tiptap/extension-image";
import { Plugin } from "@tiptap/pm/state";

const CustomImageBackend = Image.extend({
  draggable: true,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop(view, event, slice, moved) {
            if (moved) return false;
            if (!event.dataTransfer?.files[0]) return false;

            const file = event.dataTransfer.files[0];
            const formData = new FormData();
            formData.append("image", file);

            fetch("/api/images/upload", {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                const imageURI = data.url;
                const { schema } = view.state;
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                if (!coordinates) return false;

                const node = schema.nodes.image.create({ src: imageURI });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                return view.dispatch(transaction);
              })
              .catch((err) => console.error(err));

            return true;
          },
          handlePaste(view, event, slice) {
            console.log("paste");
            console.log(event.clipboardData?.files[0]);
          },
        },
      }),
    ];
  },
});

export default CustomImageBackend;
