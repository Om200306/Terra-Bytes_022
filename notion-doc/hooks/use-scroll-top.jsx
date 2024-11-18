import { useEffect, useState } from "react";

export const ScrollTop=(threshold=10)=>{
    const[scrolled,setScrolled]=useState(false);

   

    useEffect(()=>{

        const hendelScroll=()=>{
            if(window.scrollY>threshold){
                setScrolled(true);
            }else{
                setScrolled(false);
            }
        }
        
    window.addEventListener("scroll" , hendelScroll);
    return()=>window.removeEventListener("scroll",hendelScroll);

    },[scrolled]);

    return scrolled;
}
