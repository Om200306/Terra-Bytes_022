import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { UserItem } from "@/components/user-item";

import { useMutation} from "convex/react";
import { api } from "/convex/_generated/api";

import { toast } from "sonner";
import { Item } from "@/components/items";
import { DocumentList } from "@/components/document_list";
import { Popover , PopoverTrigger ,PopoverContent } from "@/components/ui/popover";
import { TrashBox } from "@/components/trash-box";



export const Navigation = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizingRef = useRef(false);
  const sidebarRef = useRef(null);
  const navbarRef = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  
  const create =useMutation(api.documents.create);

  useEffect(()=>{
    if(isMobile){
        collapse();
    }else{
      resetWidth();
    }
  },[isMobile])


  


  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current=true;
    document.addEventListener("mousemove",handleMouseMove);
    document.addEventListener("mouseup",handleMouseUp)

  };

  const handleMouseMove = (event) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth=()=>{
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(false);
      setIsResetting(true);
    
      sidebarRef.current.style.width=isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );

      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      )

      setTimeout(()=>{
        setIsResetting(false);
      },300)

  }

}

const collapse=()=>{
    if(sidebarRef.current && navbarRef.current){
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width="0";
      navbarRef.current.style.setProperty("width","100%");
      navbarRef.current.style.setProperty("left","0");

      setTimeout(()=>{
        setIsResetting(false);
      },300)
}

}

const hendleCreate=()=>{
  const promise=create({title:"Untitled"});
  toast.promise(promise,{
    loading:"Creating a new note..." ,
    success:"New note created" ,
    error:"Field to create new note"
  })
}

  return (
    <div>
      <aside
        ref={sidebarRef}
        style={{height:"100vh"}}
        className={`group/sidebar bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]
            ${isResetting ? "transition-all ease-in-out duration-300" : ""} 
            ${isMobile ? "w-0" : ""}`}
      >
        <div
        onClick={collapse}
          role="button"
          className={`h-6 w-6 text-muted-foreground rounded-sm
                 hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem/>

        <Item
        label="Search"
        icon={Search}
        isSearch
        onClick={()=>{}}
        />

         <Item
        label="Setting"
        icon={Settings}
     
        onClick={()=>{}}
        />

          <Item 
          onClick={hendleCreate}
          label="New Page"
          icon={PlusCircle}
             />
        </div>

        <div className="mt-4">
         <DocumentList/>
         <Item 
          onClick={hendleCreate}
          label="Add a Page"
          icon={Plus}
             />

             <Popover>
              <PopoverTrigger className="w-full mt-4">

              <Item 
          
          label="Trash"
          icon={Trash}
             />                

              </PopoverTrigger>
              <PopoverContent 
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}>
                     
                     <TrashBox/>
              </PopoverContent>
             </Popover>
             
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={`absolute top-0 z-[99999] left-60 w-[calc(100%-60px)] ${
          isResetting ? "transition-all ease-in-out duration-300" : ""
        } ${isMobile ? "left-0 w-full" : ""}`}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />
          )}
        </nav>
      </div>
    </div>
  );
};