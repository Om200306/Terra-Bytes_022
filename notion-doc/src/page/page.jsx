import { ThemeProvider } from "@/components/theamProvider";
import { Footer } from "../components/footer";
import { Heading } from "../components/heading";
import { Heros } from "../components/heros";
import { Navbar } from "../components/navbar";



export function Home(){
    return(
         
        <div>

        <div className="h-full">
        <Navbar/>
        
            </div>       

        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
               
               
               <main className="h-full pt-40">
               <Heading/>
               <Heros/>
                </main>
              
           
            </div>
           <Footer/>
        </div>
        </div>
    )
} 