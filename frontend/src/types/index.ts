export interface Product {
  ID: number;
  original_url: string;
  title: string;
  version: string;
  external_links: number;
  internal_links: number;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  status: 'queued' | 'running' | 'done';
  broken_link_list: BrokenLink[];
  has_login_form: boolean; // Added field for login form presence
}

export interface BrokenLink {
  url: string;
  status: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  cutout: string;
  plugins: {
    legend: {
      display: boolean;
    };
  };
}

export interface UrlFormProps {
  fetchData: () => void;
}

export interface TableProps {
  products: Product[];
  fetchData: () => void;
}

export interface LinksChartProps {
  internal: number;
  external: number;
}

export interface BrokenLinksProps {
  links: BrokenLink[];
} 