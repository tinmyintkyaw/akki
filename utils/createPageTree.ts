export default function createPageTree(pages, parentPageId) {
  const childPages = pages.filter((page) => page.parentPageId === parentPageId);

  return childPages.map((childPage) => ({
    id: childPage.id,
    pageName: childPage.pageName,
    childPages: createPageTree(pages, childPage.id),
  }));
}
