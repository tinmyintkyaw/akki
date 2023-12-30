import Document from "@tiptap/extension-document";

const CustomDocument = Document.extend({
  addStorage() {
    return {
      pageId: "",
    };
  },
});

export default CustomDocument;
