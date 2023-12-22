import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContentNoPortal,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BubbleMenu, Editor, isTextSelection } from "@tiptap/react";
import clsx from "clsx";
import {
  Bold,
  Braces,
  Check,
  ChevronRight,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  // Link,
  List,
  ListOrdered,
  ListTodo,
  LucideIcon,
  Pilcrow,
  Strikethrough,
  TextQuote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TextConvertCommand = {
  id: string;
  displayName: string;
  displayIcon: LucideIcon;
  commandFn: () => boolean;
};

export default function SelectMenu(props: { editor: Editor }) {
  const commands: TextConvertCommand[] = useMemo(() => {
    return [
      // TODO: Should open a prompt for the user to put in href and display values for the link
      // {
      //   id: "link",
      //   displayName: "Link",
      //   displayIcon: Link,
      //   commandFn: () =>
      //     props.editor.chain().focus().toggleLink({ href: "" }).run(),
      // },
      {
        id: "bulletList",
        displayName: "Bullet List",
        displayIcon: List,
        commandFn: () => props.editor.chain().focus().toggleBulletList().run(),
      },
      {
        id: "orderedList",
        displayName: "Ordered List",
        displayIcon: ListOrdered,
        commandFn: () => props.editor.chain().focus().toggleOrderedList().run(),
      },
      {
        id: "taskList",
        displayName: "Todo List",
        displayIcon: ListTodo,
        commandFn: () => props.editor.chain().focus().toggleTaskList().run(),
      },
      {
        id: "code",
        displayName: "Inline Code",
        displayIcon: Code,
        commandFn: () => props.editor.chain().focus().setCode().run(),
      },
      {
        id: "heading1",
        displayName: "Heading 1",
        displayIcon: Heading1,
        commandFn: () =>
          props.editor.chain().focus().setHeading({ level: 1 }).run(),
      },
      {
        id: "heading2",
        displayName: "Heading 2",
        displayIcon: Heading2,
        commandFn: () =>
          props.editor.chain().focus().setHeading({ level: 2 }).run(),
      },
      {
        id: "heading3",
        displayName: "Heading 3",
        displayIcon: Heading3,
        commandFn: () =>
          props.editor.chain().focus().setHeading({ level: 3 }).run(),
      },
      {
        id: "paragraph",
        displayName: "Paragraph",
        displayIcon: Pilcrow,
        commandFn: () => props.editor.chain().focus().setParagraph().run(),
      },
      {
        id: "codeBlock",
        displayName: "Code Block",
        displayIcon: Braces,
        commandFn: () => props.editor.chain().focus().toggleCodeBlock().run(),
      },
      {
        id: "blockQuote",
        displayName: "Block Quote",
        displayIcon: TextQuote,
        commandFn: () => props.editor.chain().focus().toggleBlockquote().run(),
      },
    ];
  }, [props.editor]);

  const [selected, setSelected] = useState(commands[8]);

  // Detect node type for currently selected text
  // TODO: improve detection logic & refactor
  useEffect(() => {
    const currNodeId = commands.filter((node) => {
      switch (node.id) {
        case "heading1":
          return props.editor.isActive("heading", { level: 1 });
        case "heading2":
          return props.editor.isActive("heading", { level: 2 });
        case "heading3":
          return props.editor.isActive("heading", { level: 3 });
        default:
          return props.editor.isActive(node.id);
      }
    });

    if (currNodeId.length > 0) {
      setSelected(currNodeId[0]);
    } else {
      setSelected(commands[7]);
    }
  }, [commands, props.editor, props.editor.state.selection]);

  return (
    <BubbleMenu
      editor={props.editor}
      shouldShow={({ editor, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        if (
          empty ||
          isEmptyTextBlock ||
          !editor.isEditable ||
          // Don't show on some nodes
          editor.isActive("image")
        ) {
          return false;
        }
        return true;
      }}
      tippyOptions={{
        zIndex: 50,
      }}
      className="flex max-w-md select-none rounded border bg-popover text-sm text-popover-foreground shadow-lg drop-shadow-lg transition-all"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"default"}
            className="group relative h-8 w-56 rounded px-2"
          >
            <selected.displayIcon className="h-4 w-4" />

            <span className="mx-2 flex-grow truncate text-start align-middle">
              {selected.displayName}
            </span>

            <ChevronRight className="group-radix-state-open:rotate-90 h-4 w-4 transition-transform" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContentNoPortal
          // stop radix from moving the focus to the trigger on close
          onCloseAutoFocus={() => props.editor.commands.focus()}
          className="w-radix-dropdown-menu-trigger-width"
        >
          {commands.map((command) => {
            const Icon = command.displayIcon;
            return (
              <DropdownMenuItem
                onClick={command.commandFn}
                className="flex h-8 w-full items-center rounded px-2 py-1 hover:bg-accent"
              >
                <Icon className="h-4 w-4" />

                <span className="mx-2 flex-grow truncate text-start align-middle">
                  {command.displayName}
                </span>

                {command.id === selected.id && (
                  <Check className="h-4 w-4" strokeWidth={3} />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContentNoPortal>
      </DropdownMenu>

      {/* TODO: tweak how indicators are shown when marks are active */}
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => props.editor.chain().focus().toggleBold().run()}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded",
          props.editor.isActive("bold") && "text-sky-700 hover:text-sky-700",
        )}
      >
        <Bold className="h-4 w-4" strokeWidth={3} />
      </Button>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => props.editor.chain().focus().toggleItalic().run()}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded",
          props.editor.isActive("italic") && "text-sky-700 hover:text-sky-700",
        )}
      >
        <Italic className="h-4 w-4" strokeWidth={3} />
      </Button>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => props.editor.chain().focus().toggleStrike().run()}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded",
          props.editor.isActive("strikethrough") &&
            "text-sky-700 hover:text-sky-700",
        )}
      >
        <Strikethrough className="h-4 w-4" strokeWidth={3} />
      </Button>

      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => props.editor.chain().focus().toggleCode().run()}
        className={clsx(
          "flex h-8 w-8 items-center justify-center rounded",
          props.editor.isActive("code") && "text-sky-700 hover:text-sky-700",
        )}
      >
        <Code className="h-4 w-4" strokeWidth={3} />
      </Button>
    </BubbleMenu>
  );
}
