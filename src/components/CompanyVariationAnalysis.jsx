import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, Users, TrendingUp, FileText, Merge } from 'lucide-react'
import { detectSimilarCompanies, generateVariationStats, normalizeCompanyName } from '@/utils/companyNameNormalizer'
import MergeConfirmationModal from './MergeConfirmationModal'
import sampleData from '@/sample_data.json'
import variationData from '@/sample_variation_data.json'

const CompanyVariationAnalysis = () => {
  const [allCompanies, setAllCompanies] = useState([])
  const [variationGroups, setVariationGroups] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [mergeHistory, setMergeHistory] = useState([])

  useEffect(() => {
    // サンプルデータと表記ゆれデータを結合
    const combined = [...sampleData, ...variationData]
    setAllCompanies(combined)
    analyzeVariations(combined)
  }, [])

  const analyzeVariations = (companies) => {
    setIsAnalyzing(true)
    
    // 表記ゆれグループを検出
    const groups = detectSimilarCompanies(companies)
    setVariationGroups(groups)
    
    // 統計情報を生成
    const statistics = generateVariationStats(companies)
    setStats(statistics)
    
    setIsAnalyzing(false)
  }

  const handleMergeGroup = (group) => {
    setSelectedGroup(group)
    setShowMergeModal(true)
  }

  const handleConfirmMerge = (mergeData) => {
    // 統合処理を実行
    console.log('統合処理実行:', mergeData)
    
    // 統合履歴に追加
    const historyEntry = {
      id: Date.now(),
      timestamp: mergeData.timestamp,
      mergedName: mergeData.mergedName,
      affectedCount: mergeData.affectedRecords.length,
      reason: mergeData.mergeReason,
      originalGroups: mergeData.affectedRecords.map(r => r.companyName)
    }
    setMergeHistory(prev => [historyEntry, ...prev])
    
    // 統合されたグループを表記ゆれリストから除去
    setVariationGroups(prev => 
      prev.filter(g => g.normalizedKey !== mergeData.groupId)
    )
    
    // 統計を再計算
    const remainingCompanies = allCompanies.filter(company => 
      !mergeData.affectedRecords.some(affected => affected.id === company.id)
    )
    const updatedStats = generateVariationStats(remainingCompanies)
    setStats(updatedStats)
    
    setShowMergeModal(false)
    setSelectedGroup(null)
  }

  const getStatusBadge = (status) => {
    const variants = {
      '処理済み': 'bg-green-100 text-green-800',
      '要確認': 'bg-yellow-100 text-yellow-800',
      '未処理': 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge className={`${variants[status]} text-xs`}>
        {status}
      </Badge>
    )
  }

  const getSeverityColor = (count) => {
    if (count >= 5) return 'text-red-600'
    if (count >= 3) return 'text-orange-600'
    return 'text-yellow-600'
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">事業者表記ゆれ分析</h1>
        <Button 
          onClick={() => analyzeVariations(allCompanies)}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          {isAnalyzing ? '分析中...' : '再分析'}
        </Button>
      </div>

      {/* 統計サマリー */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総事業者数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">表記ゆれグループ</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.variationGroups}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">重複可能性</p>
                  <p className="text-2xl font-bold text-red-600">{stats.potentialDuplicates}</p>
                </div>
                <FileText className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">正規化後ユニーク数</p>
                  <p className="text-2xl font-bold text-green-600">{stats.uniqueNormalizedNames}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 法人格分布 */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              法人格分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.legalEntityDistribution).map(([entity, count]) => (
                <div key={entity} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{entity}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 表記ゆれグループ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            表記ゆれ検出結果 ({variationGroups.length}グループ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {variationGroups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>表記ゆれは検出されませんでした</p>
            </div>
          ) : (
            <div className="space-y-4">
              {variationGroups.map((group, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        グループ {index + 1}
                        <span className={`ml-2 text-sm ${getSeverityColor(group.count)}`}>
                          ({group.count}件の表記ゆれ)
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        推奨統合名: <span className="font-medium">{group.suggestedName}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMergeGroup(group)}
                      className="flex items-center gap-1"
                    >
                      <Merge className="w-3 h-3" />
                      統合
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {group.companies.map((company) => (
                      <div key={company.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{company.companyName}</p>
                          <p className="text-sm text-gray-600">
                            {company.representativeName} | {company.prefecture} | {company.submissionDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(company.processingStatus)}
                          <span className="text-sm text-gray-500">
                            {company.passengerCount?.toLocaleString()}人
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 正規化例 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            正規化処理例
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { original: '東京バス株式会社', normalized: normalizeCompanyName('東京バス株式会社') },
              { original: '(株)東京バス', normalized: normalizeCompanyName('(株)東京バス') },
              { original: '㈱東京ﾊﾞｽ', normalized: normalizeCompanyName('㈱東京ﾊﾞｽ') },
              { original: '有限会社名古屋観光バス', normalized: normalizeCompanyName('有限会社名古屋観光バス') },
              { original: '(有)名古屋カンコウバス', normalized: normalizeCompanyName('(有)名古屋カンコウバス') }
            ].map((example, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">元の表記</p>
                  <p className="font-medium">{example.original}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">正規化キー</p>
                  <p className="font-mono text-sm bg-white px-2 py-1 rounded">
                    {example.normalized?.normalizedKey || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 統合履歴 */}
      {mergeHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              統合履歴 ({mergeHistory.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mergeHistory.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-3 bg-green-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-green-800">{entry.mergedName}</h4>
                      <p className="text-sm text-green-600">
                        {entry.affectedCount}件の表記ゆれを統合 | {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">完了</Badge>
                  </div>
                  {entry.reason && (
                    <p className="text-sm text-gray-600 mb-2">理由: {entry.reason}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    統合対象: {entry.originalGroups.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 統合確認モーダル */}
      <MergeConfirmationModal
        isOpen={showMergeModal}
        onClose={() => {
          setShowMergeModal(false)
          setSelectedGroup(null)
        }}
        group={selectedGroup}
        onConfirm={handleConfirmMerge}
      />
    </div>
  )
}

export default CompanyVariationAnalysis
