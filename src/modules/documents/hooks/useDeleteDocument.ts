import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '../../../api/axiosInstance';
import { API_ENDPOINTS } from '../../../constants/endpoints';
import { QueryKey } from '../../../constants/queryKey';
import type { APIResponse } from '../../../types/common.types';
import type { DocumentItem } from '../dto/documents.dto';

function useDeleteDocument() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reqBody: number) =>
      axiosInstance.delete<APIResponse<DocumentItem>>(
        API_ENDPOINTS.DOCUMENT.DELETE(reqBody),
      ),
    onSuccess() {
      /* The list the new document belongs in is now stale. */
      qc.invalidateQueries({ queryKey: [QueryKey.DOCUMENTS] });
    },
  });
}

export default useDeleteDocument;
