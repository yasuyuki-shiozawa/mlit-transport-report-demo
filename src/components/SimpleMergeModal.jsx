import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, CheckCircle, ArrowRight, Users, Calendar, MapPin, X } from 'lucide-react'

const SimpleMergeModal = ({ 
  isOpen, 
  onClose, 
  group, 
  onConfirm 
}) => {
  const [mergedName, setMergedName] = useState(group?.suggestedName || '')
  const [mergeReason, setMergeReason] = useState('')
  const [selectedMaster, setSelectedMaster] = useState(null)

  console.log('SimpleMergeModal render:', { isOpen, group: !!group })

  if (!isOpen || !group) {
    console.log('Modal not showing:', { isOpen, hasGroup: !!group })
    return null
  }

  const handleConfirm = () => {
    const mergeData = {
      groupId: group.normalizedKey,
      mergedName,
      mergeReason,
      masterRecord: selectedMaster,
      affectedRecords: group.companies,
      timestamp: new Date().toISOString()
    }
    onConfirm(mergeData)
    onClose()
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

  const totalPassengers = group.companies.reduce((sum, company) => sum + (company.passengerCount || 0), 0)
  const totalRevenue = group.companies.reduce((sum, company) => sum + (company.operatingRevenue || 0), 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            事業者統合の確認
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 統合サマリー */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 mb-2">統合対象</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>{group.companies.length}件の表記ゆれ</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>合計輸送人員: {totalPassengers.toLocaleString()}人</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>合計営業収入: ¥{totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 統合後の事業者名設定 */}
          <div className="space-y-3">
            <Label htmlFor="mergedName" className="text-sm font-medium">
              統合後の正式事業者名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mergedName"
              value={mergedName}
              onChange={(e) => setMergedName(e.target.value)}
              placeholder="統合後の正式な事業者名を入力してください"
              className="w-full"
            />
          </div>

          {/* マスターレコード選択 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              マスターレコード選択 <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-600">
              統合後に残すメインのレコードを選択してください。他のレコードの情報はこのレコードに統合されます。
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {group.companies.map((company) => (
                <div
                  key={company.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMaster?.id === company.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMaster(company)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          checked={selectedMaster?.id === company.id}
                          onChange={() => setSelectedMaster(company)}
                          className="text-blue-600"
                        />
                        <span className="font-medium text-gray-900">{company.companyName}</span>
                        {getStatusBadge(company.processingStatus)}
                      </div>
                      <div className="text-sm text-gray-600 ml-5">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {company.representativeName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.prefecture}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {company.submissionDate}
                          </span>
                        </div>
                        <div className="mt-1">
                          輸送人員: {company.passengerCount?.toLocaleString()}人 | 
                          営業収入: ¥{company.operatingRevenue?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 統合理由 */}
          <div className="space-y-3">
            <Label htmlFor="mergeReason" className="text-sm font-medium">
              統合理由・備考
            </Label>
            <Textarea
              id="mergeReason"
              value={mergeReason}
              onChange={(e) => setMergeReason(e.target.value)}
              placeholder="統合を行う理由や特記事項があれば入力してください"
              rows={3}
              className="w-full"
            />
          </div>

          {/* 統合プレビュー */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              統合後のプレビュー
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">正式事業者名:</span>
                <span className="text-green-700">{mergedName || '（未設定）'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">統合レコード数:</span>
                <span className="text-green-700">{group.companies.length}件</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">合計輸送人員:</span>
                <span className="text-green-700">{totalPassengers.toLocaleString()}人</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">合計営業収入:</span>
                <span className="text-green-700">¥{totalRevenue.toLocaleString()}</span>
              </div>
              {selectedMaster && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">マスターレコード:</span>
                  <span className="text-green-700">{selectedMaster.companyName}</span>
                </div>
              )}
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              注意事項
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 統合処理は元に戻すことができません</li>
              <li>• 統合されたレコードは履歴として保存されます</li>
              <li>• 統合後は選択したマスターレコードの情報が優先されます</li>
              <li>• 統計データは自動的に再計算されます</li>
            </ul>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!mergedName.trim() || !selectedMaster}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            統合を実行
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SimpleMergeModal
