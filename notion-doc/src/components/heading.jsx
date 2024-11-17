"use clint";

import {ArrowRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import { useConvexAuth } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";

export const Heading=()=>{

    const {isAuthenticated ,isLoading}= useConvexAuth();

    return(
        <div className=" max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Your Ideas Documents ,& Plans. Unifiled . Welcome to <span className="underline">
                    Totion
                </span>
            </h1>

            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                Totion is the connected workspace where <br />
                better , faster work happens.
            </h3>

            {
                isAuthenticated && !isLoading &&(
                    <>
                     <Button>Enter Totion
                     <ArrowRight className="h-3 w-4 ml-2"/>
                      </Button>
                    </>
                )
            }

            
            {
                !isAuthenticated &&(
                    <>
                      <SignInButton mode="model">
                    <Button size="lg">
                        Log In
                    </Button>
                </SignInButton>
                    </>
                )
            }

        </div>
    )
}