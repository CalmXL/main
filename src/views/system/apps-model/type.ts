export interface ApplicationItem {
  id: number
  name: string
  app_key: string
  description?: string
  is_enabled: boolean
  created_at: string
  updated_at: string
  models?: ApplicationModel[]
}

export interface ApplicationModel {
  id: number
  model_id: number
  is_default: boolean
  model: {
    id: number
    model_name: string
    vendor: string
    nickname?: string
  }
}
