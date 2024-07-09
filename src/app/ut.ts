export type Item = {
    type: 'channel' | 'category',
    items: Array<Item>,
    href?: string,
    name?: string,
};

export interface SidebarProps {
    items: Array<Item>;
    setCurrentPage: Function;
  }
  