import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ReportOutput = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [reportConfig, setReportConfig] = useState({
    period: '2024-01',
    format: 'pdf',
    includeCharts: true,
    includeDetails: false
  })

  const reportTemplates = [
    {
      id: 'monthly',
      title: '月次集計レポート',
      description: '月別の事業者データ集計と分析',
      icon: '📊'
    },
    {
      id: 'annual',
      title: '年次統計レポート',
      description: '年間の統計データと傾向分析',
      icon: '📈'
    },
    {
      id: 'regional',
      title: '支局別分析レポート',
      description: '地域別の詳細分析と比較',
      icon: '🗺️'
    },
    {
      id: 'anomaly',
      title: '異常値レポート',
      description: '検出された異常値の詳細分析',
      icon: '⚠️'
    },
    {
      id: 'compliance',
      title: 'コンプライアンスレポート',
      description: '法令遵守状況の確認レポート',
      icon: '📋'
    },
    {
      id: 'trend',
      title: 'トレンド分析レポート',
      description: '長期的な傾向と予測分析',
      icon: '📉'
    }
  ]

  const recentReports = [
    {
      id: 1,
      date: '2024/04/15',
      name: '月次集計レポート',
      format: 'PDF',
      size: '2.3MB',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024/03/31',
      name: '支局別分析レポート',
      format: 'Excel',
      size: '5.7MB',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024/03/15',
      name: '異常値レポート',
      format: 'PDF',
      size: '1.8MB',
      status: 'completed'
    },
    {
      id: 4,
      date: '2024/03/01',
      name: '年次統計レポート',
      format: 'PowerPoint',
      size: '12.4MB',
      status: 'completed'
    }
  ]

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      alert('レポートテンプレートを選択してください')
      return
    }
    
    // モック処理
    console.log('Generating report:', {
      template: selectedTemplate,
      config: reportConfig
    })
    
    alert('レポート生成を開始しました。完了後にダウンロードリンクが表示されます。')
  }

  const handleDownload = (reportId) => {
    console.log('Downloading report:', reportId)
    alert(`レポート ${reportId} をダウンロードします`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">レポート出力</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* レポートテンプレート選択 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>レポートテンプレート選択</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{template.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="text-blue-600">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 最近のレポート */}
          <Card>
            <CardHeader>
              <CardTitle>最近のレポート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-600">
                        {report.date} • {report.format} • {report.size}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(report.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      ダウンロード
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* レポート設定 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>レポートの設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  対象期間
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reportConfig.period}
                  onChange={(e) => setReportConfig({...reportConfig, period: e.target.value})}
                >
                  <option value="2024-04">2024年4月</option>
                  <option value="2024-03">2024年3月</option>
                  <option value="2024-02">2024年2月</option>
                  <option value="2024-01">2024年1月</option>
                  <option value="2024">2024年度</option>
                  <option value="2023">2023年度</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出力形式
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'pdf', label: 'PDF' },
                    { value: 'excel', label: 'Excel' },
                    { value: 'powerpoint', label: 'PowerPoint' }
                  ].map((format) => (
                    <label key={format.value} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={reportConfig.format === format.value}
                        onChange={(e) => setReportConfig({...reportConfig, format: e.target.value})}
                        className="mr-2"
                      />
                      {format.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeCharts}
                    onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
                    className="mr-2"
                  />
                  グラフを含む
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeDetails}
                    onChange={(e) => setReportConfig({...reportConfig, includeDetails: e.target.checked})}
                    className="mr-2"
                  />
                  詳細データを含む
                </label>
              </div>

              <Button
                onClick={handleGenerateReport}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!selectedTemplate}
              >
                レポートを作成
              </Button>
            </CardContent>
          </Card>

          {/* 生成状況 */}
          <Card>
            <CardHeader>
              <CardTitle>生成状況</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">月次レポート</span>
                  </div>
                  <span className="text-xs text-green-600">完了</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">年次レポート</span>
                  </div>
                  <span className="text-xs text-blue-600">処理中</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ReportOutput

