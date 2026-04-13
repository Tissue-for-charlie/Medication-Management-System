import request from '@/utils/request'
import type { Supplier, PaginatedResponse, SupplierFormData } from '@/types/supplier'

// 分页查询供应商
export const getSuppliers = (params: {
  page: number
  page_size: number
  search: string
}) => {
  return request.get<PaginatedResponse<Supplier>>('/api/suppliers', { params })
}

// 新增供应商
export const createSupplier = (data: SupplierFormData) => {
  return request.post<Supplier>('/api/suppliers', data)
}

// 更新供应商
export const updateSupplier = (id: number, data: SupplierFormData) => {
  return request.put<Supplier>(`/api/suppliers/${id}`, data)
}

// 删除供应商
export const deleteSupplier = (id: number) => {
  return request.delete(`/api/suppliers/${id}`)
}

// 批量删除供应商
export const batchDeleteSuppliers = (ids: number[]) => {
  return request.delete('/api/suppliers/batch', { data: { ids } })
}