import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../../../constants/queryKey';
import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import type { DocumentResponse } from '../dto/documents.dto';

function useGetDocument(id: number | null) {
  return useQuery({
    queryKey: [QueryKey.DOCUMENT_BY_ID, id],
    enabled: !!id,
    queryFn: () =>
      axiosInstance.get<DocumentResponse>(API_ENDPOINTS.DOCUMENT.BY_ID(id!)),
  });
}

export default useGetDocument;
