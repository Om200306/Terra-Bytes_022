import { useConvexAuth } from "convex/react";
import { ScrollTop } from "../../hooks/use-scroll-top"
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import {Button} from "@/components/ui/button"

export function Navbar (){

    const scrolled=ScrollTop();
    const {isAuthenticated , isLoading}= useConvexAuth();

    return(
        <div className={("z-50 bg-background fixed top-0 flex items-center w-full p-6",`${scrolled}` && "border-b shadow-sm")}>
           <Logo/>
          
           <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2 ">
           {isLoading && (
            <p>Loading</p>
           )}
           {
            !isAuthenticated && !isLoading && (
                <div className="flex items-center gap-x-4">
                <SignInButton mode="model">
                    <Button variant="ghost" size="sm">
                        Log In
                    </Button>
                </SignInButton>
                <SignInButton mode="model">
                    <Button size="sm">
                      Get Totion Free
                    </Button>
                </SignInButton>
                </div>
            )
           }
           {
            isAuthenticated && !isLoading &&(
                <>
                  <Button variant="ghost" size="sm">
                    
                    Enter Totion
                   
                      </Button>
                      <UserButton afterSignOutUrl="/"
                      />
                </>
            )
           }
          <ModeToggle/>
           </div>
        </div>
    )
}