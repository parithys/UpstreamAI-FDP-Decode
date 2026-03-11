/**
 * Export Utilities for UpstreamAI FDP
 * Comprehensive export functionality for CSV, PDF, and Excel formats
 */

// CSV Export Utility
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Auto-generate headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      // Header row
      csvHeaders.join(','),
      // Data rows
      ...data.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          // Handle values with commas, quotes, or newlines
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
    
    return true;
  } catch (error) {
    console.error('CSV Export Error:', error);
    return false;
  }
}

// JSON Export Utility
export function exportToJSON(data: any, filename: string) {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    downloadBlob(blob, `${filename}.json`);
    return true;
  } catch (error) {
    console.error('JSON Export Error:', error);
    return false;
  }
}

// Excel-compatible CSV (with BOM for proper encoding in Excel)
export function exportToExcel(data: any[], filename: string, headers?: string[]) {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const csvHeaders = headers || Object.keys(data[0]);

    // Create CSV content with Excel-specific formatting
    const csvContent = [
      csvHeaders.join(','),
      ...data.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Excel-specific: preserve leading zeros and large numbers
          if (stringValue.match(/^0\d+$/)) {
            return `="<bom>${stringValue}"`;
          }
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    // Add BOM for Excel UTF-8 recognition
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
    
    return true;
  } catch (error) {
    console.error('Excel Export Error:', error);
    return false;
  }
}

// PDF Export Utility (Basic HTML-to-Print)
export function exportToPDF(content: string, filename: string, title?: string) {
  try {
    // Create a printable window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window. Please allow popups.');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || filename}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 10pt;
              line-height: 1.4;
              color: #1f2937;
              margin: 0;
              padding: 20px;
            }
            h1 {
              color: #0047BA;
              font-size: 18pt;
              margin-bottom: 10px;
              border-bottom: 2px solid #0047BA;
              padding-bottom: 5px;
            }
            h2 {
              color: #374151;
              font-size: 14pt;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            h3 {
              color: #4b5563;
              font-size: 12pt;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 9pt;
            }
            th {
              background-color: #f3f4f6;
              color: #374151;
              font-weight: 600;
              text-align: left;
              padding: 8px;
              border: 1px solid #d1d5db;
            }
            td {
              padding: 6px 8px;
              border: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-weight: bold;
              font-size: 16pt;
              color: #0047BA;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 12pt;
              color: #6b7280;
            }
            .footer {
              margin-top: 30px;
              padding-top: 10px;
              border-top: 1px solid #d1d5db;
              font-size: 8pt;
              color: #9ca3af;
              text-align: center;
            }
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 8pt;
              font-weight: 600;
            }
            .badge-success {
              background-color: #d1fae5;
              color: #065f46;
            }
            .badge-warning {
              background-color: #fef3c7;
              color: #92400e;
            }
            .badge-danger {
              background-color: #fee2e2;
              color: #991b1b;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">UpstreamAI FDP</div>
            <div class="subtitle">${title || filename}</div>
            <div style="font-size: 9pt; color: #9ca3af; margin-top: 5px;">
              Generated: ${new Date().toLocaleString()}
            </div>
          </div>
          ${content}
          <div class="footer">
            <p>UpstreamAI Field Development Planning Platform - Confidential</p>
            <p>Document generated automatically from the UpstreamAI FDP system</p>
          </div>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="
              background-color: #0047BA;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12pt;
              margin-right: 10px;
            ">Print / Save as PDF</button>
            <button onclick="window.close()" style="
              background-color: #6b7280;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12pt;
            ">Close</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    return false;
  }
}

// Download blob utility
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Format date for export
export function formatDateForExport(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

// Format timestamp for export
export function formatTimestampForExport(timestamp: Date | string): string {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return d.toISOString().replace('T', ' ').split('.')[0];
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

// Generate filename with timestamp
export function generateFilename(base: string, extension?: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitized = sanitizeFilename(base);
  return extension ? `${sanitized}_${timestamp}.${extension}` : `${sanitized}_${timestamp}`;
}

// Export audit logs specifically
export interface AuditLogExport {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  actionType: string;
  module: string;
  details: string;
  status: string;
  ipAddress: string;
  riskLevel?: string;
  affectedRecords?: number;
}

export function exportAuditLogs(
  logs: AuditLogExport[],
  format: 'csv' | 'excel' | 'json' = 'csv',
  filename?: string
) {
  const baseFilename = filename || generateFilename('audit_logs');

  const headers = [
    'Log ID',
    'Timestamp',
    'User',
    'Role',
    'Action',
    'Action Type',
    'Module',
    'Details',
    'Status',
    'IP Address',
    'Risk Level',
    'Affected Records'
  ];

  const exportData = logs.map(log => ({
    'Log ID': log.id,
    'Timestamp': log.timestamp,
    'User': log.user,
    'Role': log.userRole,
    'Action': log.action,
    'Action Type': log.actionType,
    'Module': log.module,
    'Details': log.details,
    'Status': log.status,
    'IP Address': log.ipAddress,
    'Risk Level': log.riskLevel || 'N/A',
    'Affected Records': log.affectedRecords || 0
  }));

  if (format === 'json') {
    return exportToJSON(exportData, baseFilename);
  } else if (format === 'excel') {
    return exportToExcel(exportData, baseFilename, headers);
  } else {
    return exportToCSV(exportData, baseFilename, headers);
  }
}

// Export compliance report specifically
export function exportComplianceReport(
  metrics: any[],
  auditLogs: AuditLogExport[],
  format: 'pdf' | 'html' = 'pdf'
) {
  const timestamp = new Date().toLocaleString();
  const overallScore = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;

  const htmlContent = `
    <h1>Compliance & Governance Report</h1>
    
    <h2>Executive Summary</h2>
    <table>
      <tr>
        <td><strong>Overall Compliance Score</strong></td>
        <td><span class="badge badge-success">${overallScore.toFixed(1)}%</span></td>
      </tr>
      <tr>
        <td><strong>Total Audit Logs</strong></td>
        <td>${auditLogs.length.toLocaleString()}</td>
      </tr>
      <tr>
        <td><strong>Report Generated</strong></td>
        <td>${timestamp}</td>
      </tr>
    </table>

    <h2>Compliance Metrics</h2>
    ${metrics.map(metric => `
      <h3>${metric.category} - ${metric.score}%</h3>
      <table>
        <thead>
          <tr>
            <th>Check Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${metric.checks.map((check: any) => `
            <tr>
              <td>${check.name}</td>
              <td><span class="badge badge-${check.status === 'passed' ? 'success' : 'warning'}">${check.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `).join('')}

    <h2>Recent Audit Activity (Last 10 Events)</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>User</th>
          <th>Action</th>
          <th>Module</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${auditLogs.slice(0, 10).map(log => `
          <tr>
            <td>${log.timestamp}</td>
            <td>${log.user}<br><small>${log.userRole}</small></td>
            <td>${log.action}</td>
            <td>${log.module}</td>
            <td><span class="badge badge-${log.status === 'success' ? 'success' : 'danger'}">${log.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>Recommendations</h2>
    <ul>
      ${metrics.filter((m: any) => m.score < 95).map((m: any) => `
        <li><strong>${m.category}:</strong> Current score ${m.score}% - Review ${m.checks.filter((c: any) => c.status === 'warning').map((c: any) => c.name).join(', ')}</li>
      `).join('')}
      ${metrics.every((m: any) => m.score >= 95) ? '<li>All compliance metrics are above target. Continue current practices.</li>' : ''}
    </ul>
  `;

  return exportToPDF(htmlContent, 'compliance_report', 'UpstreamAI FDP Compliance & Governance Report');
}