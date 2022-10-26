import * as XLSX from 'xlsx'

export const convertObjectInExcel = (dataObject: Object[]) => {
  const workSheet = XLSX.utils.json_to_sheet(dataObject);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
  
  const data = XLSX.write(workBook, {bookType: 'xlsx', type: 'buffer'});

  return data;
}