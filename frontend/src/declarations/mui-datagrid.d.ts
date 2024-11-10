// src/declarations/mui-datagrid.d.ts

declare module '@mui/x-data-grid' {
    export interface GridColDef {
      field: string;
      headerName: string;
      width?: number;
      renderCell?: (params: any) => JSX.Element;
    }
  
    export interface GridRenderCellParams {
      row: any;
    }
  }
  