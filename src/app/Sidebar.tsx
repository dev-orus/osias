import React, { useState } from 'react';
import './Sidebar.css';
import { useCollapse } from 'react-collapsed';
import { Item, SidebarProps } from './ut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

export function SideBarItems(items: Array<Item>, setCurrentApp: Function, subitem = false) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: true
  });
  return items.map((v, i) => {
    if (v.type == 'category') {
      return <div key={i} className='sidebar-category'>
        <div className="category-header" {...getToggleProps()}><a>{v.name}</a></div>
        <div {...getCollapseProps()}>
          {SideBarItems(v.items, setCurrentApp, true)}
        </div>
      </div>
    } else {
      if (subitem) {
        return <div key={i} className='sidebar-channel' style={{marginLeft: '5px'}} onClick={() => setCurrentApp(v)}><a>{v.name}</a></div>
      } else {
        return <div key={i} className='sidebar-channel' onClick={() => setCurrentApp(v)}><a>{v.name}</a></div>
      }
    }
  })
}

const Sidebar: React.FC<SidebarProps> = ({ items, setCurrentApp, setIsOpen, isOpen }) => {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: false
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  try {
    if (window!=undefined) {
        window.addEventListener('keypress', (e) => {if (e.key==='b') {
            toggleSidebar();
        }});
      }
  } catch {}

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='sidebar-srv' onClick={()=>{}}>
        <div className="sidebar-header" {...getToggleProps()}><a>My Server <FontAwesomeIcon style={{color: '#9b9b9b'}} icon={faAngleDown}/></a></div>
        <div {...getCollapseProps()}>
          servers
        </div>
      </div>
      {/* <li className='sidebar-srv'><a>My Server</a></li> */}
      <nav className="sidebar-nav">
        <ul>
          {SideBarItems(items, setCurrentApp)}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
