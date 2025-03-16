import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colorOptions = [
  { label: "Orange Red", value: "#FF4500", color: "#FF4500" },
  { label: "Lime Green", value: "#32CD32", color: "#32CD32" },
  { label: "Dodger Blue", value: "#1E90FF", color: "#1E90FF" },
  { label: "Gold", value: "#FFD700", color: "#FFD700" },
  { label: "Blue Violet", value: "#8A2BE2", color: "#8A2BE2" },
  { label: "Medium Spring Green", value: "#00FA9A", color: "#00FA9A" },
  { label: "Deep Pink", value: "#FF1493", color: "#FF1493" },
  { label: "Chartreuse", value: "#7FFF00", color: "#7FFF00" },
  { label: "Crimson", value: "#DC143C", color: "#DC143C" },
  { label: "Dark Turquoise", value: "#00CED1", color: "#00CED1" },
  { label: "Dark Orange", value: "#FF8C00", color: "#FF8C00" },
  { label: "Deep Sky Blue", value: "#00BFFF", color: "#00BFFF" },
  { label: "Green Yellow", value: "#ADFF2F", color: "#ADFF2F" },
  { label: "Magenta", value: "#FF00FF", color: "#FF00FF" },
  { label: "Medium Slate Blue", value: "#7B68EE", color: "#7B68EE" },
  { label: "Turquoise", value: "#40E0D0", color: "#40E0D0" },
];

const ColorSelect = ({
  options = colorOptions,
  onSelect,
  placeholder = "Use predefined color",
}) => {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) =>
          onSelect(options.find((c) => c.value === value))
        }
      >
        <SelectTrigger className="w-[220px] bg-[#010614]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#010614] text-white border border-gray-700">
          {options.map((color) => (
            <SelectItem
              key={color.value}
              value={color.value}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color.color }}
                />
                <span>{color.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorSelect;
