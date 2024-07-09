import Category from '@/app/extensions/Category';
import Chat from './extensions/Chat';
import {Item} from './ut'

const sidebarItems: Array<Item> = [
    {
      type: 'channel',
      name: "Welcome!",
      app: () => {return <></>},
      items: []
    },
    {
      type: 'category',
      name: "test",
      app: Category,
      items: [
        {
          type: 'channel',
          name: "💬・chat",
          app: Chat,
          items: []
        },
      ]
    }
    ];

export const config = {
    sidebarItems,
    defaultItem: sidebarItems[0]
}