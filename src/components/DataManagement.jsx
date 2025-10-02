import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle, Clock, Edit, Eye, FileText, Download, Upload, Filter, Search, RefreshCw } from 'lucide-react'
import sampleData from '../sample_data.json'

const DataManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPrefecture, setFilterPrefecture] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false)
  const [data, setData] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    setData(sampleData)
  }, [])

  const filteredData = data.filter(item => {
    const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.representativeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrefecture = !filterPrefecture || item.prefecture === filterPrefecture
    const matchesStatus = !filterStatus || item.processingStatus === filterStatus
    const matchesAnomaly = !showAnomaliesOnly || item.processingStatus === '要確認'
    return matchesSearch && matchesPrefecture && matchesStatus && matchesAnomaly
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const prefectures = [...new Set(data.map(item => item.prefecture))]
  const statuses = ['処理済み', '要確認', '未処理']

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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

  const handleBulkStatusUpdate = (newStatus) => {
    setData(prev => prev.map(item => 
      selectedItems.includes(item.id) 
        ? { ...item, processingStatus: newStatus }
        : item
    ))
    setSelectedItems([])
  }

  const handleViewDetail = (item) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem({ ...item })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    setData(prev => prev.map(item => 
      item.id === editingItem.id ? editingItem : item
    ))
    setIsEditModalOpen(false)
    setEditingItem(null)
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="事業者名・代表者名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterPrefecture} onValueChange={setFilterPrefecture}>
              <SelectTrigger>
                <SelectValue placeholder="都道府県を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全エリア</SelectItem>
                {prefectures.length > 0 && prefectures.map(pref => (
                  <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="処理状況を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全ステータス</SelectItem>
                {statuses.length > 0 && statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showAnomaliesOnly ? "default" : "outline"}
              onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
              className={showAnomaliesOnly ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              要確認のみ
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
                <Button size="sm" onClick={() => handleBulkStatusUpdate('処理済み')}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  処理済みにする
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusUpdate('要確認')}>
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
          <CardTitle>データ一覧 ({sortedData.length}件中 {paginatedData.length}件表示)</CardTitle>
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
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('companyName')}
                  >
                    事業者名 {sortField === 'companyName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left p-3 font-medium">代表者名</th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('prefecture')}
                  >
                    都道府県 {sortField === 'prefecture' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('submissionDate')}
                  >
                    提出日 {sortField === 'submissionDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('passengerCount')}
                  >
                    輸送人員 {sortField === 'passengerCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-right p-3 font-medium cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('operatingRevenue')}
                  >
                    営業収入 {sortField === 'operatingRevenue' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
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
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewDetail(item)}
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          詳細
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEdit(item)}
                          className="text-xs"
                        >
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

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} / {sortedData.length}件
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  次へ
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{data.length}</div>
                <div className="text-sm text-gray-600">総データ数</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細表示モーダル */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>データ詳細</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">基本情報</TabsTrigger>
                <TabsTrigger value="financial">財務情報</TabsTrigger>
                <TabsTrigger value="history">履歴</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">事業者名</label>
                    <p className="text-lg font-medium">{selectedItem.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">代表者名</label>
                    <p className="text-lg">{selectedItem.representativeName || '未入力'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">都道府県</label>
                    <p className="text-lg">{selectedItem.prefecture}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">提出日</label>
                    <p className="text-lg">{selectedItem.submissionDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">処理状況</label>
                    <div className="mt-1">{getStatusBadge(selectedItem.processingStatus)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">エラー件数</label>
                    <p className="text-lg">{selectedItem.errorCount}件</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">輸送人員</label>
                    <p className="text-lg font-medium">{selectedItem.passengerCount.toLocaleString()}人</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">営業収入</label>
                    <p className="text-lg font-medium">¥{selectedItem.operatingRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>• 2025-01-15: データ登録</p>
                  <p>• 2025-01-16: 自動チェック完了</p>
                  <p>• 2025-01-17: 処理済みに変更</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* 編集モーダル */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>データ編集</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">事業者名</label>
                <Input
                  value={editingItem.companyName}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">代表者名</label>
                <Input
                  value={editingItem.representativeName || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, representativeName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">処理状況</label>
                <Select 
                  value={editingItem.processingStatus} 
                  onValueChange={(value) => setEditingItem(prev => ({ ...prev, processingStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.length > 0 && statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveEdit} className="flex-1">
                  保存
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataManagement
