import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { UsuarioProps } from "../types";
import { edituser } from "../service/editUser";

type EditUserArgs = {
  userId: string;
  userData: UsuarioProps;
};
export function useEditUser(
  options?: UseMutationOptions<UsuarioProps, Error, EditUserArgs>
) {
  return useMutation<UsuarioProps, Error, EditUserArgs>({
    mutationFn: async ({ userId, userData }) => {
      const result = await edituser(userId, userData);
      return result;
    },
    ...options,
  });
}
