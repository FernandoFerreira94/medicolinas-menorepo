import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { fetchUser, UsuarioProps, supabase } from "../../index";

type UserWithSession = {
  user: UsuarioProps | null;
  access_token: string;
} | null;

const getUserData = async (): Promise<UserWithSession> => {
  const storedToken = Cookies.get("auth_token");

  if (!storedToken) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const userData = await fetchUser(session.user.id as string);

  return {
    user: userData,
    access_token: session.access_token,
  };
};

export function useUser() {
  return useQuery<UserWithSession>({
    queryKey: ["user"],
    queryFn: getUserData,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
