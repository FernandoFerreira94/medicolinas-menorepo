import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/src/app/context/useAppContext";

export function Localidade() {
  const { setLocalidade, localidade } = useAppContext();

  return (
    <Select
      onValueChange={setLocalidade}
      value={localidade === null ? "all" : localidade}
    >
      <SelectTrigger className="bg-white dark:bg-[#151526]">
        <SelectValue placeholder={"Selecione a localização"} />
      </SelectTrigger>
      <SelectContent className="flex">
        <SelectItem value="all" className="flex items-center gap-2">
          All
        </SelectItem>
        <SelectItem value="Sub-Adm" className="flex items-center gap-2">
          Sub-Adm
        </SelectItem>
        <SelectItem value="CM-1" className="flex items-center gap-2">
          CM-1
        </SelectItem>
        <SelectItem value="CM-2" className="flex items-center gap-2">
          CM-2
        </SelectItem>
        <SelectItem value="Shaft" className="flex items-center gap-2">
          Shaft
        </SelectItem>
        <SelectItem value="Sub-Doca" className="flex items-center gap-2">
          Sub-Doca
        </SelectItem>
        <SelectItem value="Sub-Band" className="flex items-center gap-2">
          Sub-Band
        </SelectItem>
        <SelectItem value="Outros" className="flex items-center gap-2">
          Outros
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
