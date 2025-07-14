import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import "./UrlForm.css";
import 'primeicons/primeicons.css';
import crawlService from '../service/crawlService';
import { UrlFormProps } from '../types';

const UrlForm: React.FC<UrlFormProps> = ({ fetchData }) => {
  const [url, setUrl] = useState<string>('');

  const addUrl = (): void => {
    if (url.trim() === '') return;

    // Call parent handler to add to table
    crawlService.addUrl(url).then(() => fetchData());

    // Clear input
    setUrl('');
  };

  return (
    <div className='addUrlBox'>
      <div className="card flex flex-column md:flex-row gap-1">
        <div className="p-inputgroup">
          <InputText
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Add URL"
          />
          <Button icon="pi pi-link" className="p-button-warning" onClick={addUrl} />
        </div>
      </div>
    </div>
  );
};

export default UrlForm; 