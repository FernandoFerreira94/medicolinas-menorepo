// src/components/DateTipoMedicao.tsx

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { MdSearch } from "react-icons/md";
import { InputDate } from "@/components/ui/inputDate";
import { useAppContext } from "@/src/app/context/useAppContext";
import { useUser } from "@repo/utils";
import { useEffect } from "react"; // 👈 Importe useEffect
import { Localidade } from "./localidade";

export function DateTipoMedicao() {
  const { setTypeMedicao, typeMedicao } = useAppContext();
  const { data: user } = useUser();

  useEffect(() => {
    if (user) {
      switch (user.funcao) {
        case "Bombeiro":
          setTypeMedicao("Gas");
          break;
        case "M5-Eletricista":
          setTypeMedicao("Energia");
          break;
        case "M4-Serviços Gerais":
          setTypeMedicao("Agua");
          break;
        default:
          setTypeMedicao("Energia"); // Valor padrão se a função não for uma das opções
          break;
      }
    } else {
      // Valor padrão enquanto o usuário não estiver logado
      setTypeMedicao("Energia");
    }
  }, [user, setTypeMedicao]);

  const renderizarOpcoesDeMedicao = () => {
    // ... (restante do seu código da função renderizarOpcoesDeMedicao)
    if (
      !user ||
      (user.funcao !== "Bombeiro" &&
        user.funcao !== "M4-Serviços Gerais" &&
        user.funcao !== "M5-Eletricista")
    ) {
      return (
        <>
          <SelectItem value="Energia" className="flex items-center gap-2">
            Energia
          </SelectItem>
          <SelectItem value="Agua" className="flex items-center gap-2">
            Água
          </SelectItem>
          <SelectItem value="Gás" className="flex items-center gap-2">
            Gás
          </SelectItem>
        </>
      );
    }

    switch (user.funcao) {
      case "Bombeiro":
        return (
          <SelectItem value="Gas" className="flex items-center gap-2">
            Gás
          </SelectItem>
        );
      case "M4-Serviços Gerais":
        return (
          <SelectItem value="Agua" className="flex items-center gap-2">
            Água
          </SelectItem>
        );
      case "M5-Eletricista":
        return (
          <SelectItem value="Energia" className="flex items-center gap-2">
            Energia
          </SelectItem>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex items-center justify-end gap-20 mr-8 mt-4">
      {/* ... o restante do seu JSX */}
      <div className="w-200 h-full flex items-end relative mr-auto">
        <Input
          placeholder="Busque por loja, numero, medidor..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300  "
          type="search"
        />
        <MdSearch size={20} className="absolute left-3 top-10 text-gray-500" />
      </div>
      <div className="w-40 h-full flex items-end text-gray-900 dark:text-gray-50 ">
        <Localidade />
      </div>
      <div className="w-40 h-full flex items-end ">
        <Select required value={typeMedicao} onValueChange={setTypeMedicao}>
          <SelectTrigger>
            <SelectValue placeholder={"Selecione o tipo de medição"} />
          </SelectTrigger>
          <SelectContent className="flex">
            {renderizarOpcoesDeMedicao()}
          </SelectContent>
        </Select>
      </div>
      <div>
        <InputDate />
      </div>
    </div>
  );
}
