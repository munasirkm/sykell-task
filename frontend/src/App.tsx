import React, { useState, useEffect } from 'react';
import './App.css';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import crawlService from './service/crawlService';
import UrlForm from './components/UrlForm';
import Table from './components/Table';
import { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (): void => {
    crawlService.getAllUrls().then((data) => setProducts(data));
  };

  return (
    <div className="app-container">
      <div className='header'>
        <h1>Sykell URL Crawler</h1>
      </div>

      <div className="form-section">
        <UrlForm fetchData={fetchData} />
      </div>

      <div className="table-section">
        <Table products={products} fetchData={fetchData} />
      </div>
    </div>
  );
}

export default App; 