"use client";
import { Content } from "@/src/_componente/content";
import { useFetchUser } from "@repo/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { data, isLoading } = useFetchUser();

  return (
    <Content title="Perfil">
      {isLoading && (
        <section className="flex flex-col gap-10 w-2/5 mt-4 ">
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
        </section>
      )}
      {data && (
        <section className="flex flex-col gap-4 w-2/5 mt-4 ">
          <div className="flex flex-col gap-2 ">
            <h3 className="font-semibold text-lg">Nome:</h3>
            <p className="py-3 border border-gray-400 rounded-lg px-2 bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50 ">
              {data?.user?.nome_completo}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Função:</h3>
            <p className="py-3 border border-gray-400 rounded-lg px-2 bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50">
              {data?.user?.funcao}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Numero matricula:</h3>
            <p className="py-3 border border-gray-400 rounded-lg px-2 bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50">
              {data?.user?.matricula}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Cpf:</h3>
            <p className="py-3 border border-gray-400 rounded-lg px-2 bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50">
              {data?.user?.cpf}
            </p>
          </div>

          <h3 className="font-semibold text-lg">Mediçãoes autorizadas:</h3>
          <div className="flex items-center gap-4 bg-white py-4 px-2 rounded-lg border border-gray-400 dark:bg-[#151526] dark:text-gray-50">
            <div className="flex items-center space-x-2">
              <Switch
                id="permissao_energia"
                checked={data?.user?.permissao_energia}
              />
              <Label htmlFor="permissao_energia">Energia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="permissao_agua"
                checked={data?.user?.permissao_agua}
              />
              <Label htmlFor="permissao_agua">Água</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="permissao_gas" checked={data?.user?.permissao_gas} />
              <Label htmlFor="permisssao_gas">Gás</Label>
            </div>
          </div>
          <h3 className="font-semibold text-lg">Administrador</h3>
          <div className="flex items-center space-x-2  bg-white py-4 px-2 rounded-lg border border-gray-400 dark:bg-[#151526] dark:text-gray-50">
            <Switch id="isAdmin" checked={data?.user?.is_adm} />
            <Label htmlFor="isAdmin">Usuário Administrador</Label>
          </div>
        </section>
      )}
    </Content>
  );
}
