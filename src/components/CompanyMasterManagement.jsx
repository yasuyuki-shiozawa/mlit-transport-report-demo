import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  History, 
  MapPin, 
  Calendar,
  Users,
  FileText,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Link
} from 'lucide-react'

const CompanyMasterManagement = () => {
  const [masterCompanies, setMasterCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrefecture, setSelectedPrefecture] = useState('all')
  const [selectedCorporateType, setSelectedCorporateType] = useState('all')
  const [showRecentMerged, setShowRecentMerged] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showVariations, setShowVariations] = useState({})

  useEffect(() => {
    // サンプルの事業者マスタデータを生成
    const sampleMasterData = [
      {
        id: 'master_001',
        officialName: '株式会社東京バス',
        representativeName: '西村明彦',
        prefecture: '群馬県',
        address: '群馬県前橋市大手町1-1-1',
        phone: '027-123-4567',
        email: 'info@tokyo-bus.co.jp',
        corporateType: '株式会社',
        establishedDate: '1985-04-15',
        registrationDate: '2023-01-15',
        lastUpdated: '2025-04-27',
        mergedCount: 4,
        totalPassengers: 796948,
        totalRevenue: 1145401108,
        status: 'active',
        variations: [
          { id: 1, name: '東京バス株式会社', mergedDate: '2025-04-27' },
          { id: 2, name: '(株)東京バス', mergedDate: '2025-04-27' },
          { id: 3, name: '㈱東京ﾊﾞｽ', mergedDate: '2025-04-27' },
          { id: 4, name: 'トウキョウバス', mergedDate: '2025-04-27' }
        ]
      },
      {
        id: 'master_002',
        officialName: '株式会社大阪交通',
        representativeName: '佐藤花子',
        prefecture: '大阪府',
        address: '大阪府大阪市中央区本町2-2-2',
        phone: '06-234-5678',
        email: 'contact@osaka-kotsu.co.jp',
        corporateType: '株式会社',
        establishedDate: '1978-09-20',
        registrationDate: '2023-02-10',
        lastUpdated: '2025-03-20',
        mergedCount: 3,
        totalPassengers: 599000,
        totalRevenue: 890000000,
        status: 'active',
        variations: [
          { id: 1, name: '大阪交通株式会社', mergedDate: '2025-03-20' },
          { id: 2, name: '(株)大阪交通', mergedDate: '2025-03-20' },
          { id: 3, name: '大阪運輸株式会社', mergedDate: '2025-03-20' }
        ]
      },
      {
        id: 'master_003',
        officialName: '株式会社福岡タクシー',
        representativeName: '山田次郎',
        prefecture: '福岡県',
        address: '福岡県福岡市博多区駅前3-3-3',
        phone: '092-345-6789',
        email: 'info@fukuoka-taxi.co.jp',
        corporateType: '株式会社',
        establishedDate: '1990-12-05',
        registrationDate: '2023-03-05',
        lastUpdated: '2025-03-30',
        mergedCount: 3,
        totalPassengers: 360000,
        totalRevenue: 520000000,
        status: 'active',
        variations: [
          { id: 1, name: '福岡タクシー株式会社', mergedDate: '2025-03-30' },
          { id: 2, name: '㈱福岡タクシー', mergedDate: '2025-03-30' },
          { id: 3, name: '福岡TAXI株式会社', mergedDate: '2025-03-30' }
        ]
      },
      {
        id: 'master_004',
        officialName: '有限会社名古屋観光バス',
        representativeName: '鈴木太郎',
        prefecture: '愛知県',
        address: '愛知県名古屋市中区栄4-4-4',
        phone: '052-456-7890',
        email: 'info@nagoya-kanko.co.jp',
        corporateType: '有限会社',
        establishedDate: '1995-06-10',
        registrationDate: '2023-01-25',
        lastUpdated: '2025-02-25',
        mergedCount: 2,
        totalPassengers: 162000,
        totalRevenue: 240000000,
        status: 'active',
        variations: [
          { id: 1, name: '名古屋観光バス有限会社', mergedDate: '2025-02-25' },
          { id: 2, name: '(有)名古屋観光バス', mergedDate: '2025-02-25' }
        ]
      },
      {
        id: 'master_005',
        officialName: '合同会社北海道観光サービス',
        representativeName: '高橋三郎',
        prefecture: '北海道',
        address: '北海道札幌市中央区大通5-5-5',
        phone: '011-567-8901',
        email: 'info@hokkaido-kanko.co.jp',
        corporateType: '合同会社',
        establishedDate: '2000-03-15',
        registrationDate: '2023-02-05',
        lastUpdated: '2025-03-05',
        mergedCount: 2,
        totalPassengers: 192000,
        totalRevenue: 280000000,
        status: 'active',
        variations: [
          { id: 1, name: '北海道観光サービス合同会社', mergedDate: '2025-03-05' },
          { id: 2, name: '(同)北海道観光サービス', mergedDate: '2025-03-05' }
        ]
      }
    ]
    
    setMasterCompanies(sampleMasterData)
  }, [])

  const filteredCompanies = masterCompanies.filter(company => {
    const matchesSearch = company.officialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.representativeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrefecture = selectedPrefecture === 'all' || company.prefecture === selectedPrefecture
    const matchesCorporateType = selectedCorporateType === 'all' || company.corporateType === selectedCorporateType
    const matchesRecentMerged = !showRecentMerged || 
                               new Date(company.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    return matchesSearch && matchesPrefecture && matchesCorporateType && matchesRecentMerged
  })

  const getStatusBadge = (status) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    }
    const labels = {
      'active': 'アクティブ',
      'inactive': '非アクティブ',
      'pending': '保留中'
    }
    return (
      <Badge className={`${variants[status]} text-xs`}>
        {labels[status]}
      </Badge>
    )
  }

  const toggleVariations = (companyId) => {
    setShowVariations(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }))
  }

  const totalMasterCompanies = masterCompanies.length
  const totalVariations = masterCompanies.reduce((sum, company) => sum + company.mergedCount, 0)
  const recentlyMerged = masterCompanies.filter(company => 
    new Date(company.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">事業者マスタ管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            インポート
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新規事業者
          </Button>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">マスタ事業者数</p>
                <p className="text-2xl font-bold text-blue-600">{totalMasterCompanies}</p>
                <p className="text-xs text-gray-500">社</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Link className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">統合済み表記ゆれ</p>
                <p className="text-2xl font-bold text-orange-600">{totalVariations}</p>
                <p className="text-xs text-gray-500">件</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">最近の統合</p>
                <p className="text-2xl font-bold text-green-600">{recentlyMerged}</p>
                <p className="text-xs text-gray-500">件（7日以内）</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">アクティブ事業者</p>
                <p className="text-2xl font-bold text-purple-600">
                  {masterCompanies.filter(c => c.status === 'active').length}
                </p>
                <p className="text-xs text-gray-500">社</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <div className="space-y-2">
              <Label htmlFor="search">事業者名・代表者名</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>都道府県</Label>
              <Select value={selectedPrefecture} onValueChange={setSelectedPrefecture}>
                <SelectTrigger>
                  <SelectValue placeholder="都道府県を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="群馬県">群馬県</SelectItem>
                  <SelectItem value="大阪府">大阪府</SelectItem>
                  <SelectItem value="福岡県">福岡県</SelectItem>
                  <SelectItem value="愛知県">愛知県</SelectItem>
                  <SelectItem value="北海道">北海道</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>法人格</Label>
              <Select value={selectedCorporateType} onValueChange={setSelectedCorporateType}>
                <SelectTrigger>
                  <SelectValue placeholder="法人格を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="株式会社">株式会社</SelectItem>
                  <SelectItem value="有限会社">有限会社</SelectItem>
                  <SelectItem value="合同会社">合同会社</SelectItem>
                  <SelectItem value="合資会社">合資会社</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>表示オプション</Label>
              <Button
                variant={showRecentMerged ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRecentMerged(!showRecentMerged)}
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                最近統合のみ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 事業者マスタ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            事業者マスタ一覧 ({filteredCompanies.length}件)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{company.officialName}</h3>
                      {getStatusBadge(company.status)}
                      <Badge variant="outline" className="text-xs">
                        {company.corporateType}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{company.representativeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{company.prefecture}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>最終更新: {company.lastUpdated}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                      <div className="text-blue-600">
                        統合済み表記ゆれ: {company.mergedCount}件
                      </div>
                      <div className="text-green-600">
                        輸送人員: {company.totalPassengers.toLocaleString()}人
                      </div>
                      <div className="text-purple-600">
                        営業収入: ¥{company.totalRevenue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVariations(company.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      表記ゆれ
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-1" />
                      履歴
                    </Button>
                  </div>
                </div>

                {/* 表記ゆれ一覧 */}
                {showVariations[company.id] && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      統合済み表記ゆれ ({company.variations.length}件)
                    </h4>
                    <div className="space-y-2">
                      {company.variations.map((variation) => (
                        <div key={variation.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{variation.name}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>統合日: {variation.mergedDate}</span>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyMasterManagement
