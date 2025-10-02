import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import sampleData from '../sample_data.json'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    submitted: 0,
    processed: 0,
    anomalies: 0,
    regionalData: []
  })

  useEffect(() => {
    const totalCompanies = sampleData.length
    const submitted = sampleData.filter(item => item.processingStatus !== '未処理').length
    const processed = sampleData.filter(item => item.processingStatus === '処理済み').length
    const anomalies = sampleData.filter(item => item.processingStatus === '要確認').length

    const regionalCounts = sampleData.reduce((acc, item) => {
      acc[item.prefecture] = (acc[item.prefecture] || 0) + 1
      return acc
    }, {})

    const regionalData = Object.entries(regionalCounts).map(([region, count]) => ({
      region,
      count,
      color: 'bg-blue-500' // Simple color for now
    })).sort((a, b) => b.count - a.count)

    setStats({
      totalCompanies,
      submitted,
      processed,
      anomalies,
      regionalData
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      
      {/* 処理状況サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">登録事業者数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalCompanies.toLocaleString()}</div>
            <div className="text-sm text-gray-500">社</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">今年度提出済み</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.submitted.toLocaleString()}</div>
            <div className="text-sm text-gray-500">件 ({stats.totalCompanies > 0 ? ((stats.submitted / stats.totalCompanies) * 100).toFixed(1) : 0}%)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">処理済みデータ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.processed.toLocaleString()}</div>
            <div className="text-sm text-gray-500">件</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">要確認データ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.anomalies.toLocaleString()}</div>
            <div className="text-sm text-gray-500">件</div>
          </CardContent>
        </Card>
      </div>

      {/* 統計概要 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>都道府県別事業者数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.regionalData.map((item) => (
                <div key={item.region} className="flex items-center space-x-3">
                  <div className="w-24 text-sm text-gray-600">{item.region}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className={`${item.color} h-4 rounded-full`}
                      style={{ width: `${(item.count / (stats.regionalData[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm font-medium text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近の活動</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">データ処理完了</div>
                  <div className="text-xs text-gray-500">1,200件のファイルを正常処理</div>
                </div>
                <div className="text-xs text-gray-400">10分前</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">要確認ファイル検出</div>
                  <div className="text-xs text-gray-500">32件のファイルに異常値を検知</div>
                </div>
                <div className="text-xs text-gray-400">30分前</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">月次レポート生成</div>
                  <div className="text-xs text-gray-500">2025年8月分の集計レポートを出力</div>
                </div>
                <div className="text-xs text-gray-400">2時間前</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

