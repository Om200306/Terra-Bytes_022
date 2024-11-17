import { Logo } from "./logo";
import {Button} from "@/components/ui/button"


export function Footer(){
    return(
        <div className=" flex items-center w-full p-6 bg-background z-50 ">
            <Logo/>
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-4 text-muted-foreground">
              <Button> Privacy Policy</Button>
              <Button> Terms And Condition</Button>
              
            </div>
        </div>
    )
}
