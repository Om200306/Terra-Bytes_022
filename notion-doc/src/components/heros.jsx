

import pic1 from "../assets/empty.svg"
import pic2 from "../assets/error.svg"



export function Heros(){
    
    return(
        <div className="flex flex-col items-center  justify-center max-w-5xl">
            <div className="flex items-center gap-8  pt-6">
              <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
                
                <img src={pic1} fill className="object-contain" alt="Document" />

              </div>

              <div className="relative h-[400px] w-[400px] hidden md:block">
                 <img src={pic2} fill className="object-contain" alt="Document2" />
              </div>
            </div>
        </div>
    )

}