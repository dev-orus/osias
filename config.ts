import {Item} from './src/app/ut'
const sidebarItems: Array<Item> = [
    {
      type: 'category',
      name: "test",
      items: [
        {
          type: 'channel',
          name: "💬・chat",
          items: []
        },
      ]
    }
    ];

export const config = {
    sidebarItems
}