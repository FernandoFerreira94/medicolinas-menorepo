import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Localidade() {
  return (
    <div className="w-40 h-full flex items-end text-gray-900 dark:text-gray-50 ">
      <Select required defaultValue={"Sub-Adm"}>
        <SelectTrigger className="bg-white dark:bg-[#151526]">
          <SelectValue placeholder={"Selecione o tipo de medição"} />
        </SelectTrigger>
        <SelectContent className="flex">
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
    </div>
  );
}
