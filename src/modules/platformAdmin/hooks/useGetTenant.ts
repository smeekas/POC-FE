import { useParams } from "react-router";

export function useGetTenant() {
  const { id } = useParams<{ id: string }>();
  if(!id)throw new Error('id do not exists')
  return id
}
