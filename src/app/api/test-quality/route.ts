import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TEST_RESULTS_PATH = path.join(process.cwd(), 'public', 'test-results.json');

async function readTestResults() {
  try {
    const data = await fs.readFile(TEST_RESULTS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTestResults(results: any[]) {
  await fs.writeFile(TEST_RESULTS_PATH, JSON.stringify(results, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeDetails = searchParams.get('details') === 'true';

    const results = await readTestResults();

    if (format === 'html') {
      const htmlReport = generateHtmlReport(results);
      return new NextResponse(htmlReport, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    if (format === 'csv') {
      const csvReport = generateCsvReport(results);
      return new NextResponse(csvReport, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="test-quality-report.csv"',
        },
      });
    }

    // Default JSON response
    const summary = generateSummary(results);
    const response = {
      success: true,
      summary,
      ...(includeDetails && { details: results }),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Test quality report error:', error);
    return NextResponse.json({ 
      error: 'Test quality report could not be generated' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testResult, suiteResult } = body;

    const results = await readTestResults();

    if (testResult) {
      results.push({
        ...testResult,
        timestamp: new Date().toISOString(),
      });
    }

    if (suiteResult) {
      results.push({
        type: 'suite',
        ...suiteResult,
        timestamp: new Date().toISOString(),
      });
    }

    await writeTestResults(results);

    return NextResponse.json({
      success: true,
      message: 'Test result recorded successfully',
    });

  } catch (error) {
    console.error('Test result recording error:', error);
    return NextResponse.json({ 
      error: 'Test result could not be recorded' 
    }, { status: 500 });
  }
}

function generateSummary(results: any[]) {
  const totalTests = results.filter(r => r.type !== 'suite').length;
  const passedTests = results.filter(r => r.status === 'passed' && r.type !== 'suite').length;
  const failedTests = results.filter(r => r.status === 'failed' && r.type !== 'suite').length;
  const skippedTests = results.filter(r => r.status === 'skipped' && r.type !== 'suite').length;

  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  const averageDuration = totalTests > 0 
    ? results.filter(r => r.type !== 'suite').reduce((sum, r) => sum + (r.duration || 0), 0) / totalTests 
    : 0;

  const suites = results.filter(r => r.type === 'suite');
  const totalCoverage = suites.length > 0
    ? suites.reduce((sum, s) => sum + (s.coverage || 0), 0) / suites.length
    : 0;

  return {
    totalTests,
    passedTests,
    failedTests,
    skippedTests,
    successRate: Math.round(successRate * 100) / 100,
    averageDuration: Math.round(averageDuration * 100) / 100,
    totalCoverage: Math.round(totalCoverage * 100) / 100,
    lastUpdated: new Date().toISOString(),
  };
}

function generateHtmlReport(results: any[]) {
  const summary = generateSummary(results);
  
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Kalite Raporu - Alo17</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 10px; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .danger { color: #dc3545; }
        .info { color: #17a2b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .status-passed { color: #28a745; }
        .status-failed { color: #dc3545; }
        .status-skipped { color: #6c757d; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Kalite Raporu</h1>
        <p>Alo17 Test Sonuçları - ${new Date().toLocaleString('tr-TR')}</p>
    </div>

    <div class="metrics">
        <div class="metric">
            <div class="metric-value ${summary.successRate >= 90 ? 'success' : summary.successRate >= 70 ? 'warning' : 'danger'}">
                ${summary.successRate}%
            </div>
            <div>Başarı Oranı</div>
        </div>
        <div class="metric">
            <div class="metric-value info">${summary.totalTests}</div>
            <div>Toplam Test</div>
        </div>
        <div class="metric">
            <div class="metric-value success">${summary.passedTests}</div>
            <div>Başarılı</div>
        </div>
        <div class="metric">
            <div class="metric-value danger">${summary.failedTests}</div>
            <div>Başarısız</div>
        </div>
        <div class="metric">
            <div class="metric-value warning">${summary.skippedTests}</div>
            <div>Atlanan</div>
        </div>
        <div class="metric">
            <div class="metric-value info">${summary.averageDuration}ms</div>
            <div>Ortalama Süre</div>
        </div>
        <div class="metric">
            <div class="metric-value ${summary.totalCoverage >= 80 ? 'success' : summary.totalCoverage >= 60 ? 'warning' : 'danger'}">
                ${summary.totalCoverage}%
            </div>
            <div>Coverage</div>
        </div>
    </div>

    <h2>Test Sonuçları</h2>
    <table>
        <thead>
            <tr>
                <th>Test Adı</th>
                <th>Durum</th>
                <th>Süre (ms)</th>
                <th>Suite</th>
                <th>Tarih</th>
            </tr>
        </thead>
        <tbody>
            ${results.filter(r => r.type !== 'suite').map(result => `
                <tr>
                    <td>${result.name}</td>
                    <td class="status-${result.status}">${result.status}</td>
                    <td>${result.duration || 0}</td>
                    <td>${result.suite || 'N/A'}</td>
                    <td>${new Date(result.timestamp).toLocaleString('tr-TR')}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
  `;
}

function generateCsvReport(results: any[]) {
  const summary = generateSummary(results);
  
  let csv = 'Test Adı,Durum,Süre (ms),Suite,Tarih\n';
  
  results.filter(r => r.type !== 'suite').forEach(result => {
    csv += `"${result.name}","${result.status}",${result.duration || 0},"${result.suite || 'N/A'}","${result.timestamp}"\n`;
  });
  
  return csv;
} 