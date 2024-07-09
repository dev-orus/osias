"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { config } from './config';
import { Item } from './ut';

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentApp, setCurrentApp] = useState<Item>(config.defaultItem);
  useEffect(() => {
    if (currentApp.app === undefined) {
      setCurrentApp(config.defaultItem);
    }
  }, [currentApp]);
  return (
    <>
    <Sidebar items={config.sidebarItems} setCurrentApp={setCurrentApp} setIsOpen={setIsOpen} isOpen={isOpen}/>
    <div className={`app-extension ${isOpen ? 'open' : ''}`}><currentApp.app/></div>
    </>
  );
}
