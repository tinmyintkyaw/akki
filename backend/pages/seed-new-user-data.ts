import { ydocToTextContent } from "@/collaboration/ydoc-to-text-content.js";
import { db } from "@/db/kysely.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { MeilisearchPage } from "@project/shared-types";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { ulid } from "ulidx";
import * as Y from "yjs";

const htmlString = `
<h2>Key Features</h2>
<ul>
  <li>
    <p><strong>WYSIWYG </strong>editor with markdown shortcuts</p>
  </li>
  <li><p>Syntax highlighting</p></li>
  <li><p>Dark/Light mode</p></li>
  <li><p>Synchronization backend</p></li>
  <li><p>Powerful full-text search</p></li>
</ul>
<h2>Roadmap</h2>
<ul>
  <li><p>Import/export in multiple formats</p></li>
  <li><p>File attachments</p></li>
  <li><p>Offline editing</p></li>
  <li><p>Multi-user collaborative Editing</p></li>
</ul>
<h2>Getting Started</h2>
<ul>
  <li>
    <p>Create a new page</p>
    <blockquote>
      <p>
        TIP: You can create nested pages by clicking the "+" icon beside the
        page name in the sidebar.
      </p>
    </blockquote>
  </li>
  <li>
    <p>Search within all your notes - <code>CMD</code> + <code>P</code></p>
  </li>
</ul>
<h2>Acknowledgements</h2>
<p>
  This project would not be possible without the following awesome open source
  projects:
</p>
<ul>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://www.postgresql.org/"
        >PostgreSQL</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://vite.dev/"
        >Vite</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://react.dev/"
        >React</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://github.com/expressjs/express"
        >Express.js</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://www.meilisearch.com/"
        >Meilisearch</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://tiptap.dev/"
        >Tiptap</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://github.com/better-auth/better-auth"
        >better-auth</a
      >
    </p>
  </li>
  <li>
    <p>
      <a
        target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://github.com/yjs/yjs"
        >Y.js</a
      >
    </p>
  </li>
</ul>
`;

const defaultTiptapExtensions = [StarterKit, Link, TaskList, TaskItem, Image];

export async function seedNewUserData(userId: string) {
  const newPageId = ulid().toLowerCase();
  const newYDoc = TiptapTransformer.toYdoc(
    generateJSON(htmlString, defaultTiptapExtensions),
    "default",
    defaultTiptapExtensions,
  );

  const newPage = await db
    .insertInto("Page")
    .values(() => ({
      id: newPageId,
      userId: userId,
      pageName: "Welcome to Akki",
      ydoc: Buffer.from(Y.encodeStateAsUpdate(newYDoc)),
      path: newPageId,
    }))
    .returningAll()
    .executeTakeFirstOrThrow();

  const textContentArray = await ydocToTextContent(newYDoc);

  const meilisearchPage: MeilisearchPage = {
    id: newPage.id,
    userId: newPage.userId,
    pageName: newPage.pageName,
    textContent: textContentArray,
    isStarred: newPage.isStarred,
    createdAt: newPage.createdAt.getTime(),
    modifiedAt: newPage.modifiedAt.getTime(),
    deletedAt: newPage.deletedAt ? newPage.deletedAt.getTime() : false,
  };

  await meilisearchClient.index("pages").addDocuments([meilisearchPage]);
}
