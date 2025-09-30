"use client";
import { useState, useMemo } from "react";
import { Content } from "@/src/_componente/content";
import { Input } from "@/components/ui/input";
import { MdSearch } from "react-icons/md";
import { useFetchLojasString } from "@repo/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Definição de tipo (Assumindo a estrutura mínima dos dados da loja)
interface Loja {
  id: string;
  nome_loja: string;
  prefixo_loja: string;
  numero_loja: string;
}

export default function EditStore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useFetchLojasString(searchQuery) as {
    data: Loja[] | undefined;
    isLoading: boolean;
  };
  // console.log(data); // Removido console.log em produção

  // 1. ORDENAÇÃO DOS DADOS
  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const nomeA = a.nome_loja.toLowerCase();
      const nomeB = b.nome_loja.toLowerCase();

      if (nomeA < nomeB) return -1;
      if (nomeA > nomeB) return 1;
      return 0;
    });
  }, [data]); // Removi searchQuery daqui pois o `useFetchLojasString` já lida com a busca

  return (
    <Content title="Editar Loja">
      <div className="w-120 h-full flex items-end relative mt-10">
        {" "}
        {/* w-200 não é uma classe Tailwind padrão, mudei para w-full */}
        <Input
          placeholder="Busque pelo nome da Loja "
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 dark:bg-[#1C1C2C] dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-roxoPrimary"
          type="search"
          value={searchQuery} // Adicionei value para controlar o input
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <MdSearch
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        />{" "}
        {/* Ajustei o top e o transform para centralizar o ícone verticalmente */}
      </div>

      {/* SEÇÃO DE RESULTADOS */}
      <div className="flex gap-2 w-full mt-4">
        <div
          className="border  w-full  flex-wrap gap-4 p-8 overflow-y-auto 
          rounded-2xl bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" // Layout de grid responsivo
          // Mantive o max-h como inline style para garantir
        >
          {/* SKELETON (Carregamento) */}
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              // Gerar 10 skeletons para preencher o grid enquanto carrega
              <div key={index} className="flex flex-col gap-2 w-full">
                <Skeleton className="w-full h-10" /> {/* Skeletons menores */}
              </div>
            ))}

          {!isLoading && sortedData.length === 0 && searchQuery.length > 0 && (
            <p className="text-gray-500 col-span-full text-center">
              Nenhuma loja encontrada para &quot;{searchQuery}&quot;.
            </p>
          )}

          {!isLoading &&
            sortedData.length === 0 &&
            searchQuery.length === 0 && (
              <p className="text-gray-500 col-span-full text-center">
                Comece a digitar para buscar lojas.
              </p>
            )}

          {sortedData.map((item) => {
            // Limitar o nome da loja a 16 caracteres
            const displayNomeLoja =
              item.nome_loja.length > 16
                ? item.nome_loja.slice(0, 16) + "..."
                : item.nome_loja;

            return (
              <Link
                key={item.id}
                href={`/editStore/${item.id}`}
                className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2B2B41] transition-colors
                           truncate" // Adicionado truncate para lidar com longos nomes no link
                title={`${item.nome_loja} - ${item.prefixo_loja}-${item.numero_loja}`} // Título completo no hover
              >
                {displayNomeLoja} - {item.prefixo_loja}-{item.numero_loja}
              </Link>
            );
          })}
        </div>
      </div>
    </Content>
  );
}
