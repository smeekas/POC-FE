import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { DocumentsResponse } from '../dto/documents.dto';

function useGetDocuments(filters: Record<string, string | undefined>) {
  return useQuery({
    queryKey: [QueryKey.DOCUMENTS, ...Object.values(filters)],
    queryFn: () =>
      axiosInstance.get<DocumentsResponse>(API_ENDPOINTS.DOCUMENT.LIST, {
        params: filters,
      }),
  });
}

export default useGetDocuments;
