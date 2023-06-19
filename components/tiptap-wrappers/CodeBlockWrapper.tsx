import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
// import { Combobox } from "@headlessui/react";
// import * as Popover from "@radix-ui/react-popover";
// import * as Select from "@radix-ui/react-select";
// import { lowlight } from "lowlight/lib/core";
// import hljs, { Language } from "highlight.js";

import BlockWrapper from "./BlockWrapper";

export default function CodeBlockWrapper(props: NodeViewProps) {
  // const [language, setLanguage] = useState(() => {
  //   if (!props.node.attrs.language) return hljs.getLanguage("js") as Language;

  //   const currentLang = hljs.getLanguage(props.node.attrs.language);

  //   return currentLang ? currentLang : (hljs.getLanguage("js") as Language);
  // });

  // const languages = lowlight
  //   .listLanguages()
  //   .map((lang) => {
  //     return hljs.getLanguage(lang);
  //   })
  //   .filter((lang): lang is Language => !!lang);

  return (
    <NodeViewWrapper>
      <div className="my-1 w-full rounded bg-gray-200 px-3 py-2">
        <NodeViewContent as="pre" className="w-full px-1" />
      </div>
    </NodeViewWrapper>
  );
}
