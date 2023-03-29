export default function createPageTree(pages: any, parentPageId: any) {
  const childPages = pages.filter(
    (page: any) => page.parentPageId === parentPageId
  );

  return childPages.map((childPage: any) => ({
    // TODO: Add types
    ...childPage,
    childPages: createPageTree(pages, childPage.id),
  }));
}
