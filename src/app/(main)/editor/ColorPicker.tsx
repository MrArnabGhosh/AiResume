import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";

interface ColorPickerProps{
    color:Color | undefined;
    onChange:ColorChangeHandler
}

export default function ColorPicker({color,onChange}:ColorPickerProps){
    const [showPopover,setshowPopover]= useState(false)

    return<Popover open={showPopover} onOpenChange={setshowPopover}>
        <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    title="Change resume color"
                    onClick={()=>setshowPopover(true)}
                >
                    <PaletteIcon className="size-5"/>
                </Button>
        </PopoverTrigger>
        <PopoverContent 
        className="border-none bg-transparent shadow-none"
        align="end"
        >
            <TwitterPicker color={color} onChange={onChange} triangle="top-right"/>
        </PopoverContent>

    </Popover>

}