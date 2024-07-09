export type Item = {
    type: 'channel' | 'category',
    items: Array<Item>,
    app: React.FC,
    name?: string,
};

export interface SidebarProps {
    items: Array<Item>;
    setCurrentApp: Function;
    setIsOpen: Function;
    isOpen: boolean;
  }
  