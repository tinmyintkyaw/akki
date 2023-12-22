import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomImageBackend from "./CustomImageBackend";
import ImageWrapper from "@/components/tiptap-wrappers/ImageWrapper";

const CustomImageFrontend = CustomImageBackend.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageWrapper);
  },
});

export default CustomImageFrontend;
