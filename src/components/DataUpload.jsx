import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const DataUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStats, setUploadStats] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)
    
    const totalFiles = selectedFiles.length
    const newUploadStats = {
      total: totalFiles,
      processed: 0,
      success: 0,
      warning: 0,
      error: 0
    }
    setUploadStats(newUploadStats)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + (100 / totalFiles) // Increment progress per file
        const processed = Math.min(totalFiles, Math.floor((newProgress / 100) * totalFiles) + 1)
        
        newUploadStats.processed = processed
        newUploadStats.success = Math.floor(processed * 0.95)
        newUploadStats.warning = Math.floor(processed * 0.04)
        newUploadStats.error = processed - newUploadStats.success - newUploadStats.warning
        setUploadStats({...newUploadStats})

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setSelectedFiles([])
        }
        return Math.min(newProgress, 100)
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">データアップロード</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* アップロード画面 */}
        <Card>
          <CardHeader>
            <CardTitle>報告書アップロード</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect}
              />
              <div className="space-y-4">
                <div className="text-4xl">📁</div>
                <div>
                  <div className="text-lg font-medium">クリックしてファイルを選択</div>
                  <div className="text-sm text-gray-500">またはドラッグ&ドロップ</div>
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">選択中のファイル: {selectedFiles.length}件</h3>
                <ul className="text-sm text-gray-600 list-disc list-inside max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? 'アップロード中...' : `選択した${selectedFiles.length}件のファイルをアップロード`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ファイル一覧・進捗 */}
        {(isUploading || uploadStats) && (
          <Card>
            <CardHeader>
              <CardTitle>処理進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>全体進捗</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3" />
                </div>
                
                {uploadStats && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>処理済み:</span>
                      <span className="font-medium">{uploadStats.processed.toLocaleString()}件</span>
                    </div>
                    <div className="flex justify-between">
                      <span>全体:</span>
                      <span className="font-medium">{uploadStats.total.toLocaleString()}件</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>正常処理:</span>
                      <span className="font-medium">{uploadStats.success.toLocaleString()}件</span>
                    </div>
                    <div className="flex justify-between text-yellow-600">
                      <span>要確認:</span>
                      <span className="font-medium">{uploadStats.warning.toLocaleString()}件</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>エラー:</span>
                      <span className="font-medium">{uploadStats.error.toLocaleString()}件</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DataUpload

