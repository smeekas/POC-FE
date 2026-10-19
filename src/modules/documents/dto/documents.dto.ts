import type {
  APIResponse,
  PaginatedAPIResponse,
} from '../../../types/common.types';

export type DocumentItem = {
  created_by: number;
  id: number;
  title: string;
  user: {
    email: string;
  };
  tags?: string[];
};

/* The list carries only what the table shows; fetching one document carries the body
   too, which is what the edit form needs to fill itself in. */
export type DocumentDetail = DocumentItem & {
  description: string;
};

export type DocumentsResponse = PaginatedAPIResponse<DocumentItem[]>;
export type DocumentResponse = APIResponse<DocumentDetail>;

export type CreateDocumentRequest = {
  title: string;
  description: string;
  tags?: string[];
};

export type UpdateDocumentRequest = CreateDocumentRequest;
