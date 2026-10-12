import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import type { DocumentDetail, UpdateDocumentRequest } from '../dto/documents.dto';

function useUpdateDocument(id: number | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reqBody: UpdateDocumentRequest) =>
      axiosInstance.patch<APIResponse<DocumentDetail>>(
        API_ENDPOINTS.DOCUMENT.BY_ID(id!),
        reqBody,
      ),
    onSuccess() {
      /* Both the list and this document's own cache entry now hold the old title. */
      qc.invalidateQueries({ queryKey: [QueryKey.DOCUMENTS] });
      qc.invalidateQueries({ queryKey: [QueryKey.DOCUMENT_BY_ID, id] });
    },
  });
}

export default useUpdateDocument;
