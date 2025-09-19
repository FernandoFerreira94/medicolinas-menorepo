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
  disabled?: boolean;
}

export function Localidade({
  value,
  setValue,
  disabled = false,
}: LocalidadeProps) {
  return (
    <Select onValueChange={setValue} value={value} disabled={disabled}>
      <SelectTrigger className="bg-white dark:bg-[#151526]">
        <SelectValue placeholder={"Selecione a localização"} />
      </SelectTrigger>
      <SelectContent className="flex">
        <SelectItem value="all" className="flex items-center gap-2">
          Todos
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
        <SelectItem value="Shaft-NT" className="flex items-center gap-2">
          Shaft - NT
        </SelectItem>
        <SelectItem value="Shaft-NS" className="flex items-center gap-2">
          Shaft - NS
        </SelectItem>
        <SelectItem value="piso26" className="flex items-center gap-2">
          Area tecnica 26
        </SelectItem>
        <SelectItem value="piso27" className="flex items-center gap-2">
          Area tecnica 27
        </SelectItem>
        <SelectItem value="Sub-Doca" className="flex items-center gap-2">
          Sub-Doca
        </SelectItem>
        <SelectItem value="Hotel" className="flex items-center gap-2">
          Hotel
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
