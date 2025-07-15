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
import { Dropdown } from 'primereact/dropdown';

const Table: React.FC<TableProps> = ({ products, fetchData }) => {
  const [expandedRows, setExpandedRows] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'queued' | 'running' | 'done'>('all');
  const [loginFormFilter, setLoginFormFilter] = useState<'all' | 'yes' | 'no'>('all');
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

  // Filtered products with status and login form filters
  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      product.original_url.toLowerCase().includes(searchLower) ||
      product.title.toLowerCase().includes(searchLower);
    const matchesStatus =
      statusFilter === 'all' || product.status === statusFilter;
    const matchesLoginForm =
      loginFormFilter === 'all' ||
      (loginFormFilter === 'yes' && product.has_login_form) ||
      (loginFormFilter === 'no' && !product.has_login_form);
    return matchesSearch && matchesStatus && matchesLoginForm;
  });

  return (
    <div className="card">
      <ConfirmDialog />
      <div className="table-header-bar" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
        <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.92em', color: '#555', marginRight: '0.2rem' }}>Status:</span>
          <Dropdown
            value={statusFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Queued', value: 'queued' },
              { label: 'Running', value: 'running' },
              { label: 'Done', value: 'done' },
            ]}
            onChange={e => setStatusFilter(e.value)}
            placeholder="Status"
            style={{ width: '6rem', fontSize: '0.85em' }}
          />
          <span style={{ fontSize: '0.92em', color: '#555', marginLeft: '0.5rem', marginRight: '0.2rem' }}>Login Form:</span>
          <Dropdown
            value={loginFormFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            onChange={e => setLoginFormFilter(e.value)}
            placeholder="Login"
            style={{ width: '6rem', fontSize: '0.85em' }}
          />
          <div className="search-input-wrapper" style={{ marginLeft: '0.5rem' }}>
            <i className="pi pi-search search-icon" />
            <input
              type="text"
              className="global-search-box"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <DataTable
        value={filteredProducts}
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
        <Column 
          header={<span>Login<br />Form</span>}
          body={(rowData: Product) => (
            rowData.has_login_form ? (
              <i className="pi pi-check" style={{ color: 'green', fontSize: '0.8rem', display: 'block', textAlign: 'center' }}></i>
            ) : (
              <i className="pi pi-times" style={{ color: 'red', fontSize: '0.8rem', display: 'block', textAlign: 'center' }}></i>
            )
          )}
          style={{ width: '4rem', textAlign: 'center' }}
        />
        <Column field="external_links" header={<span>External<br />Links</span>} sortable />
        <Column field="internal_links" header={<span>Internal<br />Links</span>} sortable />
        <Column field="h1_count" header="H1" sortable />
        <Column field="h2_count" header="H2" sortable />
        <Column field="h3_count" header="H3" sortable />
        <Column field="h4_count" header="H4" sortable />
        <Column field="h5_count" header="H5" sortable />
        <Column field="h6_count" header="H6" sortable />
        <Column field="status" header="Staus" sortable />
        <Column
          body={actionBodyTemplate}
        />
      </DataTable>
    </div>
  );
};

export default Table; 