/**
 * 事業者名の表記ゆれ検出・正規化ユーティリティ
 */

// 法人格の正規化マッピング
const LEGAL_ENTITY_PATTERNS = {
  '株式会社': ['株式会社', '(株)', '㈱', 'カ)', 'ｶ)'],
  '有限会社': ['有限会社', '(有)', '㈲', 'ユ)', 'ﾕ)'],
  '合同会社': ['合同会社', '(同)', '㈳', 'ゴ)', 'ｺﾞ)'],
  '合資会社': ['合資会社', '(資)', '㈾', 'シ)', 'ｼ)'],
  '一般社団法人': ['一般社団法人', '(一社)', '㈳'],
  '公益社団法人': ['公益社団法人', '(公社)', '㈳'],
  '財団法人': ['財団法人', '(財)', '㈶'],
  '社会福祉法人': ['社会福祉法人', '(社福)', '㈳'],
  '医療法人': ['医療法人', '(医)', '㈱'],
  '学校法人': ['学校法人', '(学)', '㈱'],
  '宗教法人': ['宗教法人', '(宗)', '㈱']
}

// 交通関連の一般的な略語・表記ゆれ
const TRANSPORT_TERMS = {
  'バス': ['バス', 'ﾊﾞｽ', 'bus', 'Bus', 'BUS'],
  'タクシー': ['タクシー', 'ﾀｸｼｰ', 'taxi', 'Taxi', 'TAXI'],
  '交通': ['交通', 'ｺｳﾂｳ', '運輸', 'ｳﾝﾕ'],
  '観光': ['観光', 'ｶﾝｺｳ', 'ツーリズム', 'tourism', 'Tourism'],
  '運送': ['運送', 'ｳﾝｿｳ', '運輸', 'ｳﾝﾕ'],
  'サービス': ['サービス', 'ｻｰﾋﾞｽ', 'service', 'Service', 'SERVICE']
}

/**
 * 文字列を正規化する
 * @param {string} text - 正規化対象の文字列
 * @returns {string} 正規化された文字列
 */
function normalizeText(text) {
  if (!text) return ''
  
  // 全角英数字を半角に変換
  let normalized = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  })
  
  // 全角カタカナを半角カタカナに変換
  normalized = normalized.replace(/[ァ-ヶ]/g, (s) => {
    const code = s.charCodeAt(0)
    if (code >= 0x30A1 && code <= 0x30F6) {
      return String.fromCharCode(code - 0x60)
    }
    return s
  })
  
  // 不要な記号・空白を除去
  normalized = normalized.replace(/[・\s\-_\(\)（）【】「」『』]/g, '')
  
  return normalized.toLowerCase()
}

/**
 * 法人格を正規化する
 * @param {string} companyName - 会社名
 * @returns {object} { normalizedName, legalEntity, baseName }
 */
function normalizeLegalEntity(companyName) {
  if (!companyName) return { normalizedName: '', legalEntity: '', baseName: '' }
  
  let normalizedName = companyName
  let legalEntity = ''
  let baseName = companyName
  
  // 法人格のパターンマッチング
  for (const [standard, patterns] of Object.entries(LEGAL_ENTITY_PATTERNS)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.replace(/[()]/g, '\\$&'), 'gi')
      if (regex.test(companyName)) {
        legalEntity = standard
        baseName = companyName.replace(regex, '').trim()
        normalizedName = `${standard}${baseName}`
        break
      }
    }
    if (legalEntity) break
  }
  
  return { normalizedName, legalEntity, baseName }
}

/**
 * 交通関連用語を正規化する
 * @param {string} text - 正規化対象のテキスト
 * @returns {string} 正規化されたテキスト
 */
function normalizeTransportTerms(text) {
  let normalized = text
  
  for (const [standard, variants] of Object.entries(TRANSPORT_TERMS)) {
    for (const variant of variants) {
      const regex = new RegExp(variant, 'gi')
      normalized = normalized.replace(regex, standard)
    }
  }
  
  return normalized
}

/**
 * 会社名を完全に正規化する
 * @param {string} companyName - 会社名
 * @returns {object} 正規化結果
 */
export function normalizeCompanyName(companyName) {
  if (!companyName) return null
  
  // 1. 基本的な文字正規化
  const basicNormalized = normalizeText(companyName)
  
  // 2. 法人格の正規化
  const { normalizedName, legalEntity, baseName } = normalizeLegalEntity(companyName)
  
  // 3. 交通関連用語の正規化
  const transportNormalized = normalizeTransportTerms(baseName)
  
  // 4. 最終的な正規化キー生成
  const normalizedKey = normalizeText(transportNormalized)
  
  return {
    original: companyName,
    normalized: normalizedName,
    normalizedKey,
    legalEntity,
    baseName: transportNormalized,
    basicNormalized
  }
}

/**
 * 複数の会社名から表記ゆれグループを検出する
 * @param {Array} companies - 会社データの配列
 * @returns {Array} 表記ゆれグループの配列
 */
export function detectSimilarCompanies(companies) {
  const normalizedMap = new Map()
  const groups = []
  
  // 各会社名を正規化してグループ化
  companies.forEach(company => {
    const normalized = normalizeCompanyName(company.companyName)
    if (!normalized) return
    
    const key = normalized.normalizedKey
    
    if (!normalizedMap.has(key)) {
      normalizedMap.set(key, [])
    }
    
    normalizedMap.get(key).push({
      ...company,
      normalized
    })
  })
  
  // 2件以上のグループのみを表記ゆれ候補として返す
  normalizedMap.forEach((group, key) => {
    if (group.length > 1) {
      groups.push({
        normalizedKey: key,
        companies: group,
        count: group.length,
        suggestedName: group[0].normalized.normalized // 最初の正規化名を推奨名とする
      })
    }
  })
  
  return groups.sort((a, b) => b.count - a.count) // 件数の多い順にソート
}

/**
 * 類似度を計算する（レーベンシュタイン距離ベース）
 * @param {string} str1 - 文字列1
 * @param {string} str2 - 文字列2
 * @returns {number} 類似度（0-1の範囲）
 */
export function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0
  
  const len1 = str1.length
  const len2 = str2.length
  
  if (len1 === 0) return len2 === 0 ? 1 : 0
  if (len2 === 0) return 0
  
  const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0))
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 削除
        matrix[i][j - 1] + 1,      // 挿入
        matrix[i - 1][j - 1] + cost // 置換
      )
    }
  }
  
  const maxLen = Math.max(len1, len2)
  return (maxLen - matrix[len1][len2]) / maxLen
}

/**
 * 表記ゆれの統計情報を生成する
 * @param {Array} companies - 会社データの配列
 * @returns {object} 統計情報
 */
export function generateVariationStats(companies) {
  const similarGroups = detectSimilarCompanies(companies)
  
  const stats = {
    totalCompanies: companies.length,
    uniqueNormalizedNames: new Set(companies.map(c => normalizeCompanyName(c.companyName)?.normalizedKey).filter(Boolean)).size,
    variationGroups: similarGroups.length,
    totalVariations: similarGroups.reduce((sum, group) => sum + group.count, 0),
    potentialDuplicates: similarGroups.reduce((sum, group) => sum + (group.count - 1), 0),
    legalEntityDistribution: {},
    topVariationGroups: similarGroups.slice(0, 10)
  }
  
  // 法人格の分布を計算
  companies.forEach(company => {
    const normalized = normalizeCompanyName(company.companyName)
    if (normalized?.legalEntity) {
      const entity = normalized.legalEntity
      stats.legalEntityDistribution[entity] = (stats.legalEntityDistribution[entity] || 0) + 1
    }
  })
  
  return stats
}
