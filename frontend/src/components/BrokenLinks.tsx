import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './BrokenLinks.css';
import { BrokenLinksProps } from '../types';

const BrokenLinks: React.FC<BrokenLinksProps> = ({ links }) => {
  return (
    <div className="card">
      <DataTable
        className="broken-links-table"
        value={links}
        paginator
        rows={5}
        scrollable
        scrollHeight="flex"
        style={{ width: '100%' }}
        tableStyle={{ minWidth: '40rem' }}
      >
        <Column
          field="url"
          header="URL"
          bodyStyle={{ minWidth: '70rem' }}
          className="broken-links-url-col"
        />
        <Column
          field="status"
          header="Status Code"
          frozen
          alignFrozen="right"
          bodyStyle={{ width: '8rem', textAlign: 'center' }}
        />
      </DataTable>
    </div>
  );
};

export default BrokenLinks; 