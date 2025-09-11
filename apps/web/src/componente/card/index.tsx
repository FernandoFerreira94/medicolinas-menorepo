import { Button } from "@/components/ui/button";

export function Card() {
  return (
    <div
      className=" border-l-8 border-red-500 flex flex-col w-75 h-45 gap-1 justify-between py-2 px-4 rounded-xl   text-gray-900  dark:text-gray-50
   bg-white dark:bg-[#151526] hover:shadow-[2px_2px_10px_4px_#A7B3C3,-2px_-2px_10px_#FFFFFF] transition-shadow duration-300 shadow-xl
    "
    >
      <div className="w-full flex justify-between">
        <span className="text-lg font-semibold">Americana</span>
        <div className="flex gap-2">
          <span className="text-lg font-semibold">NT-110</span>
          <span className="bg-green-500  rounded-full my-1.5 px-2"> </span>
        </div>
      </div>

      <div className="w-full flex justify-between">
        <span>N relogio</span>

        <span> 598445</span>
      </div>

      <div className="w-full flex justify-between">
        <span>Localidade</span>

        <span>CM-2</span>
      </div>

      <div className="w-full flex justify-between">
        <span>Medição atual</span>

        <span>-- -- --</span>
      </div>
      <div className="w-full flex justify-between gap-6">
        <Button variant={"outline"} className="h-8 w-full">
          info
        </Button>
        <Button className="w-full h-8">Medição</Button>
      </div>
    </div>
  );
}
