"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { config } from '../../config';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>('');
  return (
    <>
    <Sidebar items={config.sidebarItems} setCurrentPage={setCurrentPage}/>
    <h1>{currentPage}</h1>
    </>
  );
}
