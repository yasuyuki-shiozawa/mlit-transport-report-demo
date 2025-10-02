import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ErrorReview = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const mockErrors = [
    {
      id: 1,
      filename: 'error1.xlsx',
      company: '株式会社ABC',
      type: 'エラー',
      detail: '無効なデータ形式',
      status: 'pending',
      severity: 'error'
    },
    {
      id: 2,
      filename: 'warning2.xlsx',
      company: '合同会社123',
      type: '警告',
      detail: 'コードが不正です',
      status: 'pending',
      severity: 'warning'
    },
    {
      id: 3,
      filename: 'data3.xlsx',
      company: 'サンプル事業',
      type: 'エラー',
      detail: 'レコードが欠損しています',
      status: 'pending',
      severity: 'error'
    },
    {
      id: 4,
      filename: 'report4.xlsx',
      company: '株式会社ABC',
      type: '要確認',
      detail: '入力値を確認してください',
      status: 'pending',
      severity: 'review'
    },
    {
      id: 5,
      filename: 'transport5.xlsx',
      company: '東京運輸株式会社',
      type: '警告',
      detail: '車両数が前年比で大幅に増加',
      status: 'pending',
      severity: 'warning'
    },
    {
      id: 6,
      filename: 'business6.xlsx',
      company: '関西物流サービス',
      type: '要確認',
      detail: '営業収入の計算に不整合',
      status: 'pending',
      severity: 'review'
    }
  ]

  const filters = [
    { id: 'all', label: '全て', count: mockErrors.length },
    { id: 'error', label: 'エラー', count: mockErrors.filter(e => e.severity === 'error').length },
    { id: 'warning', label: '警告', count: mockErrors.filter(e => e.severity === 'warning').length },
    { id: 'review', label: '要確認', count: mockErrors.filter(e => e.severity === 'review').length }
  ]

  const filteredErrors = activeFilter === 'all' 
    ? mockErrors 
    : mockErrors.filter(error => error.severity === activeFilter)

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAction = (id, action) => {
    console.log(`Action ${action} for item ${id}`)
    // ここで実際の処理を行う
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">エラー・要確認</h1>
      
      {/* フィルタタブ */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* エラー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeFilter === 'all' ? '全ての問題' : filters.find(f => f.id === activeFilter)?.label}
            ({filteredErrors.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">ファイル名</th>
                  <th className="text-left p-3 font-medium">事業者名</th>
                  <th className="text-left p-3 font-medium">エラー種別</th>
                  <th className="text-left p-3 font-medium">詳細</th>
                  <th className="text-left p-3 font-medium">状態</th>
                  <th className="text-left p-3 font-medium">アクション</th>
                </tr>
              </thead>
              <tbody>
                {filteredErrors.map((error) => (
                  <tr key={error.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{error.filename}</td>
                    <td className="p-3 font-medium">{error.company}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                        {error.type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{error.detail}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        未対応
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(error.id, 'reprocess')}
                          className="text-xs"
                        >
                          再処理
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(error.id, 'ignore')}
                          className="text-xs"
                        >
                          無視
                        </Button>
                        {error.severity === 'review' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(error.id, 'fix')}
                            className="text-xs"
                          >
                            修正
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredErrors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              該当する問題はありません
            </div>
          )}
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {mockErrors.filter(e => e.severity === 'error').length}
            </div>
            <div className="text-sm text-gray-600">エラー</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {mockErrors.filter(e => e.severity === 'warning').length}
            </div>
            <div className="text-sm text-gray-600">警告</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {mockErrors.filter(e => e.severity === 'review').length}
            </div>
            <div className="text-sm text-gray-600">要確認</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {mockErrors.length}
            </div>
            <div className="text-sm text-gray-600">総件数</div>
          </CardContent>
        </Card>
      </div>

      {/* 一括操作 */}
      <Card>
        <CardHeader>
          <CardTitle>一括操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => console.log('Bulk reprocess')}>
              選択項目を再処理
            </Button>
            <Button variant="outline" onClick={() => console.log('Bulk ignore')}>
              選択項目を無視
            </Button>
            <Button variant="outline" onClick={() => console.log('Export errors')}>
              エラーリストをエクスポート
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorReview

