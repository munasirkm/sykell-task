import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import crawlService from '../service/crawlService';
import LinksChart from './LinksChart';
import BrokenLinks from './BrokenLinks';
import './Table.css';
import { TableProps, Product } from '../types';

import { ConfirmDialog } from 'primereact/confirmdialog'; // For <ConfirmDialog /> component
import { confirmDialog } from 'primereact/confirmdialog'; // For confirmDialog method

const Table: React.FC<TableProps> = ({ products, fetchData }) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hasRunning = products.some(product => product.status === 'running');

    if (hasRunning) {
      // Start interval if not already started
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          fetchData();
        }, 5000);
      }
    } else {
      // Clear interval if no running status
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [products, fetchData]);

  const rowExpansionTemplate = (data: Product) => {
    return (
      <div className=" row-expansion-container">
        <LinksChart internal={data.internal_links} external={data.external_links} />
        <BrokenLinks links={data.broken_link_list} />
      </div>
    );
  };

  const actionHeaderTemplate = () => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-refresh"
          severity="info"
          rounded
          text
          size="small"
          disabled={!selectedRows.length}
          onClick={() => crawlService.reanalyzeUrl(selectedRows.map(item => item.ID)).then(() => fetchData())}
        />

        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          text
          size="small"
          onClick={() => confirm1(() => crawlService.deleteUrl(selectedRows.map(item => item.ID)).then(() => fetchData()))}
          disabled={!selectedRows.length}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Product) => {
    const { status } = rowData;

    let icon: string | null = null;
    let ariaLabel: string = '';

    if (status === 'queued') {
      icon = 'pi pi-play-circle';
      ariaLabel = 'Run';
    } else if (status === 'running') {
      icon = 'pi pi-stop-circle';
      ariaLabel = 'Stop';
    } else if (status === 'done') {
      icon = 'pi pi-refresh';
      ariaLabel = 'Refresh';
    }

    return (
      <div className="action-buttons">
        {icon && (
          <Button
            icon={icon}
            severity="info"
            rounded
            text
            size="small"
            aria-label={ariaLabel}
            onClick={() => crawlService.reanalyzeUrl([rowData.ID]).then(() => fetchData())}
          />
        )}
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          text
          size="small"
          aria-label="Remove"
          onClick={() => confirm1(() => crawlService.deleteUrl([rowData.ID]).then(() => fetchData()))}
        />
      </div>
    );
  };

  const confirm1 = (accept: () => void) => {
    confirmDialog({
      message: 'Are you sure you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      acceptClassName: 'p-button-danger',
      accept,
    });
  };

  return (
    <div className="card">
      <ConfirmDialog />
      <DataTable
        value={products}
        paginator
        rows={15}
        stateStorage={'local'}
        expandedRows={expandedRows}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        selectionMode="checkbox"
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="ID"
        tableStyle={{ minWidth: '95rem' }}
        onRowClick={(e) => {
          const rowData = e.data;
          const id = rowData.ID;
          const isExpanded = expandedRows && expandedRows[id];

          const newExpandedRows = { ...expandedRows };

          if (isExpanded) {
            delete newExpandedRows[id];
          } else {
            newExpandedRows[id] = true;
          }

          setExpandedRows(newExpandedRows);
        }}
      >
        <Column selectionMode="multiple" className="narrow-checkbox-column" />
        <Column field='original_url' header='Url' style={{ wordWrap: 'normal' }} />
        <Column field="title" header="Title" sortable />
        
        <Column field="external_links" header="#Ex_Links" sortable />
        <Column field="internal_links" header="#Int_Links" sortable />
        <Column field="h1_count" header="H1" sortable />
        <Column field="h2_count" header="H2" sortable />
        <Column field="h3_count" header="H3" sortable />
        <Column field="h4_count" header="H4" sortable />
        <Column field="h5_count" header="H5" sortable />
        <Column field="h6_count" header="H6" sortable />
        <Column field="status" header="Staus" sortable />
        <Column
          header={actionHeaderTemplate}
          body={actionBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default Table; 