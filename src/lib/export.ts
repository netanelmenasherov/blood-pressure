import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { IBPLog } from '@/models/BPLog';
import { format } from 'date-fns';

export function exportToExcel(logs: IBPLog[]) {
    const data = logs.map(log => ({
        Date: format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        Systolic: log.systolic,
        Diastolic: log.diastolic,
        HeartRate: log.heartRate,
        AlertLevel: log.overallAlert,
        Notes: log.note || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BP Logs');

    XLSX.writeFile(workbook, `bp-logs-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export function exportToPDF(logs: IBPLog[]) {
    const doc = new jsPDF();

    doc.text('Blood Pressure Log Report', 14, 15);
    doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd')}`, 14, 22);

    const tableData = logs.map(log => [
        format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm'),
        log.systolic,
        log.diastolic,
        log.heartRate,
        log.overallAlert,
        log.note || ''
    ]);

    autoTable(doc, {
        head: [['Date/Time', 'Sys', 'Dia', 'HR', 'Alert', 'Notes']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
    });

    doc.save(`bp-logs-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
