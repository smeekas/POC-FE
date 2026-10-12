import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import type { CreateDocumentRequest, DocumentItem } from '../dto/documents.dto';

function useCreateDocument() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reqBody: CreateDocumentRequest) =>
      axiosInstance.post<APIResponse<DocumentItem>>(
        API_ENDPOINTS.DOCUMENT.CREATE,
        reqBody,
      ),
    onSuccess() {
      /* The list the new document belongs in is now stale. */
      qc.invalidateQueries({ queryKey: [QueryKey.DOCUMENTS] });
    },
  });
}

export default useCreateDocument;
