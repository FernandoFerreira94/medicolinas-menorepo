"use client";
import { useState } from "react";
import { Content } from "@/src/_componente/content";
import { Input } from "@/components/ui/input";
import { MdSearch } from "react-icons/md";
import { useFetchLojas } from "@repo/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useFetchLojas(
    null,
    null,
    null,
    searchQuery
  );
  console.log(data);

  return (
    <Content title="Editar Loja">
      <div className="w-200 h-full flex items-end relative mr-auto mt-10">
        <Input
          placeholder="Busque por loja, numero, medidor..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300  "
          type="search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <MdSearch size={20} className="absolute left-3 top-4 text-gray-500" />
      </div>
      <div className="flex  gap-2 w-full  mt-4">
        <div
          className="border flex w-full flex-col h-full max-h-420 flex-wrap gap-4 p-8 
        rounded-2xl
        bg-white text-gray-900 font-medium dark:bg-[#151526] dark:text-gray-50  "
        >
          {error && <p>{error.message}</p>}
          {isLoading && (
            <div className="flex gap-12">
              <div className="flex flex-col justify-center gap-2 w-2/12">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
              <div className="flex flex-col gap-2 w-2/12">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
              <div className="flex flex-col gap-2 w-2/12">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
              <div className="flex flex-col gap-2 w-2/12">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
              <div className="flex flex-col gap-2 w-2/12">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            </div>
          )}
          {data?.map((item) => (
            <Link
              key={item.id}
              href={`/editStore/${item.id}`}
              className="hover:text-blue-400 cursor-pointer"
            >
              {item.nome_loja} - {item.prefixo_loja}-{item.numero_loja}{" "}
            </Link>
          ))}
        </div>
      </div>
    </Content>
  );
}
