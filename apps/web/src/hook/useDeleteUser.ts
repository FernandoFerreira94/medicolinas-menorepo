// src/hooks/useDeleteUser.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

async function deleteUser(userId: string) {
  const response = await fetch(`/api/usuarios/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao deletar o usuário.");
  }

  const data = await response.json();
  return data;
}

export function useDeleteUser(
  options?: UseMutationOptions<unknown, Error, string>
) {
  return useMutation({
    mutationFn: deleteUser,

    ...options,
  });
}
