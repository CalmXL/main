export interface FeedbackItem {
  id: string
  feedUserName?: string
  feedTitle: string
  feedContent: string
  feedStatus: string
  gmtCreate: string
  backTime?: string | null
  planTime?: string
  expectedTime?: string
  backContent?: string
  gmtModified?: string | null
  fileList?: {
    fileName: string
    fileUrl: string
    id: 'b685f36771c34cf191d90e2691a237ca'
  }[]
}

export interface FeedbackListParams {
  page: number
  page_size: number
  keyword?: string
  status?: string
}

export interface FeedbackApiResponse {
  id: string
  gmtCreate: string
  gmtModified: string | null
  delFlag: number
  feedUserId: string
  feedUserName: string
  feedTitle: string
  feedContent: string
  feedStatus: string
  backContent: string | null
  backUserId: string | null
  backUserName: string | null
  backTime?: string
}

export interface FeedbackListResponse {
  list: FeedbackApiResponse[]
  total: number
}
