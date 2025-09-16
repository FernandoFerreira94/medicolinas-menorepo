import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definindo os tipos das props para maior clareza e segurança
interface LocalidadeProps {
  value: string;
  setValue: (value: string) => void;
}

export function Localidade({ value, setValue }: LocalidadeProps) {
  return (
    <Select onValueChange={setValue} value={value === "" ? "all" : value}>
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
