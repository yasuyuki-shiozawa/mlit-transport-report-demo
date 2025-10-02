import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

// 画面コンポーネント
import Dashboard from './components/Dashboard'
import DataUpload from './components/DataUpload'
import DataManagement from './components/DataManagement'
import Analytics from './components/Analytics'
import ErrorReview from './components/ErrorReview'
import ReportOutput from './components/ReportOutput'
import UserManagement from './components/UserManagement'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード' },
    { id: 'upload', label: 'データアップロード' },
    { id: 'management', label: 'データ管理' },
    { id: 'analytics', label: '集計・分析' },
    { id: 'error', label: 'エラー・要確認' },
    { id: 'report', label: 'レポート出力' },
    { id: 'user', label: 'ユーザー管理' }
  ]

  const renderCurrentPage = () => {
    try {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />
        case 'upload':
          return <DataUpload />
        case 'management':
          return <DataManagement />
        case 'analytics':
          return <Analytics />
        case 'error':
          return <ErrorReview />
        case 'report':
          return <ReportOutput />
        case 'user':
          return <UserManagement />
        default:
          return <Dashboard />
      }
    } catch (error) {
      console.error('Error rendering page:', error)
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
          <p className="text-gray-600 mb-4">現在のページ: {currentPage}</p>
          <p className="text-gray-600 mb-4">エラー: {error.message}</p>
          <Button onClick={() => setCurrentPage('dashboard')}>
            ダッシュボードに戻る
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">輸送実績報告書集計システム</div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">管理者ユーザー</span>
              <Button variant="outline" size="sm" className="text-blue-600 bg-white hover:bg-gray-100">
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-blue-500 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white border-b-2 border-white'
                    : 'text-blue-100 hover:text-white hover:bg-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App

