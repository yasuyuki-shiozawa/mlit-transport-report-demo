import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle, CheckCircle, Clock, Edit, Eye, FileText, Download, Upload, Filter, Search, RefreshCw } from 'lucide-react'

const DataManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // サンプルデータ
  const sampleData = [
    {
      id: 1000001,
      companyName: "Azリゾートサービス株式会社",
      representativeName: "小澤秀人",
      prefecture: "群馬県",
      submissionDate: "2025-01-15",
      processingStatus: "処理済み",
      passengerCount: 632874,
      operatingRevenue: 192337967,
      errorCount: 0
    },
    {
      id: 1000002,
      companyName: "OTS交通株式会社",
      representativeName: "平良剛",
      prefecture: "茨城県",
      submissionDate: "2025-04-12",
      processingStatus: "要確認",
      passengerCount: 41398,
      operatingRevenue: 524834573,
      errorCount: 1
    },
    {
      id: 1000003,
      companyName: "いりおもて観光株式会社",
      representativeName: "屋宜靖",
      prefecture: "千葉県",
      submissionDate: "2025-01-23",
      processingStatus: "未処理",
      passengerCount: 195648,
      operatingRevenue: 85278686,
      errorCount: 0
    }
  ]

  useEffect(() => {
    setData(sampleData)
  }, [])

  const filteredData = data.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.representativeName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedData.map(item => item.id))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case '処理済み':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case '要確認':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case '未処理':
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      '処理済み': 'bg-green-100 text-green-800',
      '要確認': 'bg-yellow-100 text-yellow-800',
      '未処理': 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge className={`${variants[status]} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">データ管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            インポート
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
        </div>
      </div>
      
      {/* 検索・フィルタ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            検索・フィルタ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="事業者名・代表者名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              要確認のみ表示
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 一括操作 */}
      {selectedItems.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length}件選択中
              </span>
              <div className="flex gap-2">
                <Button size="sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  処理済みにする
                </Button>
                <Button size="sm" variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  要確認にする
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedItems([])}>
                  選択解除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* データテーブル */}
      <Card>
        <CardHeader>
          <CardTitle>データ一覧 ({filteredData.length}件中 {paginatedData.length}件表示)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">
                    <Checkbox
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-3 font-medium">事業者名</th>
                  <th className="text-left p-3 font-medium">代表者名</th>
                  <th className="text-left p-3 font-medium">都道府県</th>
                  <th className="text-left p-3 font-medium">提出日</th>
                  <th className="text-right p-3 font-medium">輸送人員</th>
                  <th className="text-right p-3 font-medium">営業収入</th>
                  <th className="text-center p-3 font-medium">状態</th>
                  <th className="text-center p-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      item.processingStatus === '要確認' ? 'bg-yellow-50' : ''
                    } ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{item.companyName}</td>
                    <td className="p-3">{item.representativeName || '未入力'}</td>
                    <td className="p-3">{item.prefecture}</td>
                    <td className="p-3">{item.submissionDate}</td>
                    <td className="p-3 text-right">{item.passengerCount.toLocaleString()}人</td>
                    <td className="p-3 text-right">¥{item.operatingRevenue.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {getStatusBadge(item.processingStatus)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          詳細
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Edit className="w-3 h-3 mr-1" />
                          編集
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              検索条件に一致するデータがありません
            </div>
          )}
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {data.filter(item => item.processingStatus === '処理済み').length}
                </div>
                <div className="text-sm text-gray-600">処理済み</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.filter(item => item.processingStatus === '要確認').length}
                </div>
                <div className="text-sm text-gray-600">要確認</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {data.filter(item => item.processingStatus === '未処理').length}
                </div>
                <div className="text-sm text-gray-600">未処理</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DataManagement
