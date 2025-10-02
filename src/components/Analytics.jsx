import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter, 
  Settings, 
  Eye,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Users,
  FileSpreadsheet,
  FileText,
  Printer
} from 'lucide-react'
import sampleData from '../sample_data.json'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('graphs')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedPrefectures, setSelectedPrefectures] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState(['処理済み', '要確認', '未処理'])
  const [chartType, setChartType] = useState('bar')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    regionalData: [],
    statusData: [],
    revenueData: [],
    monthlyData: []
  })

  useEffect(() => {
    // フィルタリングされたデータを生成
    const filteredData = sampleData.filter(item => {
      const prefectureMatch = selectedPrefectures.length === 0 || selectedPrefectures.includes(item.prefecture)
      const statusMatch = selectedStatuses.includes(item.processingStatus)
      return prefectureMatch && statusMatch
    })

    // サンプルデータから分析用データを生成
    const regionalCounts = filteredData.reduce((acc, item) => {
      acc[item.prefecture] = (acc[item.prefecture] || 0) + 1
      return acc
    }, {})

    const regionalData = Object.entries(regionalCounts).map(([region, count]) => ({
      region,
      count,
      vehicles: Math.floor(count * (Math.random() * 20 + 10)),
      revenue: Math.floor(count * (Math.random() * 50000000 + 30000000)),
      passengers: filteredData.filter(item => item.prefecture === region)
        .reduce((sum, item) => sum + item.passengerCount, 0)
    })).sort((a, b) => b.count - a.count)

    const statusData = [
      { 
        status: '処理済み', 
        count: filteredData.filter(item => item.processingStatus === '処理済み').length,
        percentage: (filteredData.filter(item => item.processingStatus === '処理済み').length / filteredData.length * 100).toFixed(1)
      },
      { 
        status: '要確認', 
        count: filteredData.filter(item => item.processingStatus === '要確認').length,
        percentage: (filteredData.filter(item => item.processingStatus === '要確認').length / filteredData.length * 100).toFixed(1)
      },
      { 
        status: '未処理', 
        count: filteredData.filter(item => item.processingStatus === '未処理').length,
        percentage: (filteredData.filter(item => item.processingStatus === '未処理').length / filteredData.length * 100).toFixed(1)
      }
    ]

    const revenueData = filteredData.map(item => ({
      companyName: item.companyName,
      revenue: item.operatingRevenue,
      passengers: item.passengerCount,
      prefecture: item.prefecture
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 10)

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: `${i + 1}月`,
      processed: Math.floor(Math.random() * 40) + 60,
      submitted: Math.floor(Math.random() * 50) + 70,
      errors: Math.floor(Math.random() * 10) + 5
    }))

    setAnalyticsData({ regionalData, statusData, revenueData, monthlyData })
  }, [selectedPrefectures, selectedStatuses])

  const tabs = [
    { id: 'graphs', label: 'グラフ', icon: BarChart3 },
    { id: 'simple', label: '単純集計表', icon: FileSpreadsheet },
    { id: 'yearly', label: '経年表', icon: TrendingUp },
    { id: 'cross', label: 'クロス集計', icon: PieChart }
  ]

  const prefectures = [...new Set(sampleData.map(item => item.prefecture))]
  const statuses = ['処理済み', '要確認', '未処理']

  const handlePrefectureFilter = (prefecture) => {
    setSelectedPrefectures(prev => 
      prev.includes(prefecture) 
        ? prev.filter(p => p !== prefecture)
        : [...prev, prefecture]
    )
  }

  const handleStatusFilter = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handleExport = (format) => {
    // エクスポート処理のシミュレーション
    console.log(`Exporting data in ${format} format`)
    setIsExportModalOpen(false)
  }

  const renderSimpleAggregation = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            都道府県別集計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">都道府県</th>
                  <th className="text-right p-3 font-medium">事業者数</th>
                  <th className="text-right p-3 font-medium">車両数合計</th>
                  <th className="text-right p-3 font-medium">輸送人員合計</th>
                  <th className="text-right p-3 font-medium">営業収入合計</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.regionalData.map((item, index) => (
                  <tr key={item.region} className={`border-b hover:bg-gray-50 ${index < 3 ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {item.region}
                      {index < 3 && <Badge variant="secondary">TOP{index + 1}</Badge>}
                    </td>
                    <td className="p-3 text-right font-medium">{item.count.toLocaleString()}</td>
                    <td className="p-3 text-right">{item.vehicles.toLocaleString()}</td>
                    <td className="p-3 text-right">{item.passengers.toLocaleString()}人</td>
                    <td className="p-3 text-right">¥{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-gray-100 font-medium">
                  <td className="p-3">合計</td>
                  <td className="p-3 text-right">{analyticsData.regionalData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}</td>
                  <td className="p-3 text-right">{analyticsData.regionalData.reduce((sum, item) => sum + item.vehicles, 0).toLocaleString()}</td>
                  <td className="p-3 text-right">{analyticsData.regionalData.reduce((sum, item) => sum + item.passengers, 0).toLocaleString()}人</td>
                  <td className="p-3 text-right">¥{analyticsData.regionalData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderYearlyTrends = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            年度別推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">年度</th>
                  <th className="text-right p-3 font-medium">事業者数</th>
                  <th className="text-right p-3 font-medium">車両数合計</th>
                  <th className="text-right p-3 font-medium">営業収入合計</th>
                  <th className="text-right p-3 font-medium">前年比</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: '2021', companies: 47, vehicles: 720, revenue: 2340000000, growth: '-' },
                  { year: '2022', companies: 48, vehicles: 741, revenue: 2410000000, growth: '+2.8%' },
                  { year: '2023', companies: 49, vehicles: 762, revenue: 2480000000, growth: '+3.1%' },
                  { year: '2024', companies: 50, vehicles: 774, revenue: 2520000000, growth: '+1.4%' },
                  { year: '2025', companies: sampleData.length, vehicles: 782, revenue: 2560000000, growth: '+1.8%' }
                ].map((item, index) => (
                  <tr key={item.year} className={`border-b hover:bg-gray-50 ${item.year === selectedYear ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {item.year}
                      {item.year === selectedYear && <Badge>選択中</Badge>}
                    </td>
                    <td className="p-3 text-right">{item.companies.toLocaleString()}</td>
                    <td className="p-3 text-right">{item.vehicles.toLocaleString()}</td>
                    <td className="p-3 text-right">¥{item.revenue.toLocaleString()}</td>
                    <td className={`p-3 text-right font-medium ${
                      item.growth.startsWith('+') ? 'text-green-600' : 
                      item.growth.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCrossTabulation = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            都道府県×処理状況 クロス集計
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">都道府県</th>
                  <th className="text-right p-3 font-medium text-green-600">処理済み</th>
                  <th className="text-right p-3 font-medium text-yellow-600">要確認</th>
                  <th className="text-right p-3 font-medium text-gray-600">未処理</th>
                  <th className="text-right p-3 font-medium">合計</th>
                  <th className="text-right p-3 font-medium">処理率</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.regionalData.map((item) => {
                  const regionData = sampleData.filter(d => d.prefecture === item.region)
                  const processed = regionData.filter(d => d.processingStatus === '処理済み').length
                  const warning = regionData.filter(d => d.processingStatus === '要確認').length
                  const unprocessed = regionData.filter(d => d.processingStatus === '未処理').length
                  const processRate = ((processed / item.count) * 100).toFixed(1)
                  
                  return (
                    <tr key={item.region} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.region}</td>
                      <td className="p-3 text-right text-green-600 font-medium">{processed}</td>
                      <td className="p-3 text-right text-yellow-600 font-medium">{warning}</td>
                      <td className="p-3 text-right text-gray-600 font-medium">{unprocessed}</td>
                      <td className="p-3 text-right font-medium">{item.count}</td>
                      <td className="p-3 text-right">
                        <Badge variant={parseFloat(processRate) >= 80 ? 'default' : parseFloat(processRate) >= 60 ? 'secondary' : 'destructive'}>
                          {processRate}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGraphs = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              都道府県別事業者数
            </span>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">棒グラフ</SelectItem>
                <SelectItem value="horizontal">横棒</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.regionalData.slice(0, 8).map((item, index) => (
              <div key={item.region} className="flex items-center space-x-3 group hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="w-20 text-sm text-gray-600 font-medium">{item.region}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500 ease-out`}
                    style={{ width: `${(item.count / (analyticsData.regionalData[0]?.count || 1)) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">{item.count}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            処理状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {analyticsData.statusData.map((item, index) => {
                  const colors = ['#10b981', '#f59e0b', '#6b7280']
                  const total = analyticsData.statusData.reduce((sum, s) => sum + s.count, 0)
                  const percentage = (item.count / total) * 100
                  const strokeDasharray = `${percentage} ${100 - percentage}`
                  const strokeDashoffset = index === 0 ? 0 : 
                    -analyticsData.statusData.slice(0, index).reduce((sum, s) => sum + (s.count / total) * 100, 0)
                  
                  return (
                    <circle
                      key={item.status}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={colors[index]}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:stroke-width-10"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold">{analyticsData.statusData.reduce((sum, s) => sum + s.count, 0)}</div>
                  <div className="text-xs text-gray-600">事業者</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {analyticsData.statusData.map((item, index) => (
              <div key={item.status} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${
                    item.status === '処理済み' ? 'bg-green-500' :
                    item.status === '要確認' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.count}件</span>
                  <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            営業収入上位10社
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analyticsData.revenueData.slice(0, 5).map((item, index) => (
              <div key={item.companyName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="text-sm font-medium block truncate max-w-48">{item.companyName}</span>
                    <span className="text-xs text-gray-500">{item.prefecture}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">¥{item.revenue.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 block">{item.passengers.toLocaleString()}人</span>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2">
              全て表示
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            月別処理件数推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end space-x-1 p-4 bg-gray-50 rounded-lg">
            {analyticsData.monthlyData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-end space-y-1">
                  <div 
                    className="bg-blue-500 w-full rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{ height: `${(item.processed / 100) * 100}px` }}
                    title={`処理済み: ${item.processed}件`}
                  ></div>
                  <div 
                    className="bg-yellow-500 w-full hover:bg-yellow-600 transition-colors cursor-pointer"
                    style={{ height: `${(item.errors / 100) * 50}px` }}
                    title={`エラー: ${item.errors}件`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 group-hover:font-medium transition-all">{item.monthName}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>処理済み</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>エラー</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'simple':
        return renderSimpleAggregation()
      case 'yearly':
        return renderYearlyTrends()
      case 'cross':
        return renderCrossTabulation()
      case 'graphs':
        return renderGraphs()
      default:
        return renderGraphs()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">集計・分析</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025年度</SelectItem>
              <SelectItem value="2024">2024年度</SelectItem>
              <SelectItem value="2023">2023年度</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                フィルタ
                {(selectedPrefectures.length > 0 || selectedStatuses.length < 3) && (
                  <Badge variant="secondary" className="ml-2">{selectedPrefectures.length + (3 - selectedStatuses.length)}</Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>フィルタ設定</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">都道府県</label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {prefectures.map(prefecture => (
                      <div key={prefecture} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedPrefectures.includes(prefecture)}
                          onCheckedChange={() => handlePrefectureFilter(prefecture)}
                        />
                        <span className="text-sm">{prefecture}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">処理状況</label>
                  <div className="space-y-2 mt-2">
                    {statuses.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => handleStatusFilter(status)}
                        />
                        <span className="text-sm">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      setSelectedPrefectures([])
                      setSelectedStatuses(['処理済み', '要確認', '未処理'])
                    }}
                    variant="outline" 
                    className="flex-1"
                  >
                    リセット
                  </Button>
                  <Button onClick={() => setIsFilterModalOpen(false)} className="flex-1">
                    適用
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                エクスポート
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>エクスポート形式を選択</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleExport('excel')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel (.xlsx)
                </Button>
                <Button 
                  onClick={() => handleExport('csv')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  CSV (.csv)
                </Button>
                <Button 
                  onClick={() => handleExport('pdf')} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  PDF (.pdf)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* タブナビゲーション */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="graphs" className="mt-6">
          {renderGraphs()}
        </TabsContent>
        <TabsContent value="simple" className="mt-6">
          {renderSimpleAggregation()}
        </TabsContent>
        <TabsContent value="yearly" className="mt-6">
          {renderYearlyTrends()}
        </TabsContent>
        <TabsContent value="cross" className="mt-6">
          {renderCrossTabulation()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Analytics
