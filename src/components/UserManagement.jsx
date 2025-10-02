import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const UserManagement = () => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    bureau: ''
  })

  const mockUsers = [
    {
      id: 1,
      name: '田中 太郎',
      email: 'tanaka@mlit.go.jp',
      role: 'admin',
      bureau: '本省',
      lastLogin: '2024/04/15 14:30',
      status: 'active'
    },
    {
      id: 2,
      name: '佐藤 花子',
      email: 'sato@kanto.mlit.go.jp',
      role: 'editor',
      bureau: '関東運輸局',
      lastLogin: '2024/04/15 09:15',
      status: 'active'
    },
    {
      id: 3,
      name: '鈴木 一郎',
      email: 'suzuki@kansai.mlit.go.jp',
      role: 'viewer',
      bureau: '近畿運輸局',
      lastLogin: '2024/04/14 16:45',
      status: 'active'
    },
    {
      id: 4,
      name: '高橋 美咲',
      email: 'takahashi@chubu.mlit.go.jp',
      role: 'editor',
      bureau: '中部運輸局',
      lastLogin: '2024/04/12 11:20',
      status: 'inactive'
    },
    {
      id: 5,
      name: '伊藤 健太',
      email: 'ito@kyushu.mlit.go.jp',
      role: 'viewer',
      bureau: '九州運輸局',
      lastLogin: '2024/04/10 13:55',
      status: 'active'
    }
  ]

  const roles = [
    { value: 'admin', label: '管理者', description: '全機能の利用・ユーザー管理' },
    { value: 'editor', label: '編集者', description: 'データ編集・レポート作成' },
    { value: 'viewer', label: '閲覧者', description: 'データ閲覧・レポート閲覧のみ' }
  ]

  const bureaus = [
    '本省', '北海道運輸局', '東北運輸局', '関東運輸局', '北陸信越運輸局',
    '中部運輸局', '近畿運輸局', '中国運輸局', '四国運輸局', '九州運輸局', '沖縄総合事務局'
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'editor':
        return 'bg-blue-100 text-blue-800'
      case 'viewer':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.bureau) {
      alert('必要な項目を入力してください')
      return
    }
    
    console.log('Adding user:', newUser)
    alert('ユーザーを追加しました')
    setNewUser({ name: '', email: '', role: 'viewer', bureau: '' })
    setShowAddUser(false)
  }

  const handleUserAction = (userId, action) => {
    console.log(`Action ${action} for user ${userId}`)
    alert(`ユーザー ${userId} に対して ${action} を実行しました`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <Button
          onClick={() => setShowAddUser(!showAddUser)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showAddUser ? 'キャンセル' : '新規ユーザー追加'}
        </Button>
      </div>

      {/* 新規ユーザー追加フォーム */}
      {showAddUser && (
        <Card>
          <CardHeader>
            <CardTitle>新規ユーザー追加</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  氏名 *
                </label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="田中 太郎"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス *
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="tanaka@mlit.go.jp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  権限
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.bureau}
                  onChange={(e) => setNewUser({...newUser, bureau: e.target.value})}
                >
                  <option value="">選択してください</option>
                  {bureaus.map((bureau) => (
                    <option key={bureau} value={bureau}>{bureau}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
                追加
              </Button>
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                キャンセル
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ユーザー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>登録ユーザー一覧 ({mockUsers.length}名)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">氏名</th>
                  <th className="text-left p-3 font-medium">メールアドレス</th>
                  <th className="text-left p-3 font-medium">権限</th>
                  <th className="text-left p-3 font-medium">所属</th>
                  <th className="text-left p-3 font-medium">最終ログイン</th>
                  <th className="text-left p-3 font-medium">状態</th>
                  <th className="text-left p-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {roles.find(r => r.value === user.role)?.label}
                      </span>
                    </td>
                    <td className="p-3">{user.bureau}</td>
                    <td className="p-3 text-gray-600">{user.lastLogin}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'edit')}
                          className="text-xs"
                        >
                          編集
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, user.status === 'active' ? 'deactivate' : 'activate')}
                          className="text-xs"
                        >
                          {user.status === 'active' ? '無効化' : '有効化'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 権限説明 */}
      <Card>
        <CardHeader>
          <CardTitle>権限について</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.value} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.value)}`}>
                  {role.label}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-gray-700">{role.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mockUsers.length}</div>
            <div className="text-sm text-gray-600">総ユーザー数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {mockUsers.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">アクティブユーザー</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {mockUsers.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">管理者</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(mockUsers.map(u => u.bureau)).size}
            </div>
            <div className="text-sm text-gray-600">参加組織数</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserManagement

